import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SANITY_SCHEMA_DIR = path.join(ROOT, 'studio', 'schemaTypes');
const GROQ_FILE = path.join(ROOT, 'src', 'data', 'blocks.js');
const PAGE_SCHEMA_PATH = path.join(SANITY_SCHEMA_DIR, 'page.ts');

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkSchemaExists(sectionName: string) {
    const schemaPath = path.join(SANITY_SCHEMA_DIR, `${sectionName}.ts`);
    try {
        await fs.access(schemaPath);
    } catch {
        throw new Error(`Sanity schema "${sectionName}" not found in studio/schemaTypes`);
    }
}

export async function checkSectionRegisteredInPage(sectionName: string) {
    const pageSchema = await readFile(PAGE_SCHEMA_PATH);
    const pattern = new RegExp(`\{\\s*type: ['\"]${sectionName}['\"]\\s*\}`);
    if (!pattern.test(pageSchema)) {
        throw new Error(`"${sectionName}" missing in page.ts sections[]`);
    }
}

export async function checkGroqProjectsIdsAndImages(sectionName: string) {
    const groq = await readFile(GROQ_FILE);
    const sectionPattern = new RegExp(`_type == ['\"]${sectionName}['\"] => \\{([\\s\\S]*?)\\n  \\},?`, 'm');
    const sectionMatch = groq.match(sectionPattern);
    if (!sectionMatch) {
        throw new Error(`GROQ projection for "${sectionName}" missing in src/data/blocks.js`);
    }

    const block = sectionMatch[1];
    if (!block.includes('"_id": coalesce(_id, _key)')) {
        throw new Error(`SECTIONS projection missing _id for ${sectionName}`);
    }

    const arrayBlocks = [...block.matchAll(/\w+\[\]\s*\{([\s\S]*?)\n\s*\},?/g)];
    for (const match of arrayBlocks) {
        const arrayBody = match[1];
        if (!arrayBody.includes('"_id": coalesce(_id, _key)')) {
            throw new Error(`SECTIONS projection missing _id for nested array in ${sectionName}`);
        }
    }

    const expectsImageId = /image\s*\{/.test(block);
    if (expectsImageId && !/"_id": image\.asset->_id/.test(block)) {
        throw new Error(`Image projection missing _id for ${sectionName}`);
    }
}

export async function checkGroqImageProjections(sectionName: string) {
    const groq = await readFile(GROQ_FILE);
    const sectionPattern = new RegExp(`_type == ['\"]${sectionName}['\"] => \\{([\\s\\S]*?)\\n  \\},?`, 'm');
    const sectionMatch = groq.match(sectionPattern);
    if (!sectionMatch) return; // Skip if section not found

    const block = sectionMatch[1];

    // Check for image ${IMAGE} projection (only if there are image fields at main section level, not in arrays)
    const lines = block.split('\n');
    const mainSectionLines = lines.filter(line => {
        const trimmed = line.trim();
        return !trimmed.includes('[]') && !trimmed.startsWith('items[]') && !trimmed.includes('{');
    });
    const hasMainSectionImages = mainSectionLines.some(line => line.includes('image'));

    if (hasMainSectionImages && !block.includes('${IMAGE}')) {
        throw new Error(`${sectionName} GROQ projection missing \${IMAGE} for image fields`);
    }

    // Check that nested arrays project all required fields including images
    const arrayBlocks = [...block.matchAll(/\w+\[\]\s*\{([\s\S]*?)\n\s*\},?/g)];
    for (const match of arrayBlocks) {
        const arrayBody = match[1];
        if (arrayBody.includes('image') && !arrayBody.includes('${ENRICHED_IMAGE}')) {
            throw new Error(`Nested array in ${sectionName} missing \${ENRICHED_IMAGE} projection for images`);
        }
    }
}

export async function checkSchemaStructure(sectionName: string) {
    const schemaPath = path.join(SANITY_SCHEMA_DIR, `${sectionName}.ts`);
    const content = await readFile(schemaPath);

    // Check camelCase field names
    const fieldMatches = [...content.matchAll(/defineField\(\{\s*name:\s*['"]([^'"]+)['"]/g)];
    for (const [, fieldName] of fieldMatches) {
        if (!/^[a-z][a-zA-Z0-9]*$/.test(fieldName)) {
            throw new Error(`Field "${fieldName}" in ${sectionName} is not camelCase`);
        }
    }

    // Check extends SECTION_BASE_FIELDS
    if (!content.includes('SECTION_BASE_FIELDS') && !content.includes('SECTION_BASE_GROUPS')) {
        throw new Error(`${sectionName} schema does not extend SECTION_BASE_FIELDS or SECTION_BASE_GROUPS`);
    }
}

export async function checkSchemaRegisteredInIndex(sectionName: string) {
    const indexPath = path.join(SANITY_SCHEMA_DIR, 'index.ts');
    const content = await readFile(indexPath);

    if (!content.includes(sectionName)) {
        throw new Error(`${sectionName} not registered in studio/schemaTypes/index.ts`);
    }
}

export async function checkNestedObjectSchemas(sectionName: string) {
    const schemaPath = path.join(SANITY_SCHEMA_DIR, `${sectionName}.ts`);
    const content = await readFile(schemaPath);

    // Check for nested object references (exclude the main schema type)
    const objectMatches = [...content.matchAll(/type:\s*['"]([^'"]+)['"]/g)];
    for (const [, objectType] of objectMatches) {
        if (objectType !== 'string' && objectType !== 'number' && objectType !== 'boolean' &&
            objectType !== 'array' && objectType !== 'image' && objectType !== 'slug' &&
            objectType !== 'markdown' && objectType !== 'text' && objectType !== 'url' &&
            !objectType.includes('Section') && objectType !== 'actionButton' && objectType !== 'actionLink' &&
            objectType !== 'object') { // Exclude main schema type

            const nestedSchemaPath = path.join(SANITY_SCHEMA_DIR, `${objectType}.ts`);
            try {
                await fs.access(nestedSchemaPath);
            } catch {
                throw new Error(`Nested object "${objectType}" referenced in ${sectionName} but schema file not found`);
            }
        }
    }
}