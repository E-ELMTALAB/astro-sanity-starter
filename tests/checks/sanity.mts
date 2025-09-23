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
