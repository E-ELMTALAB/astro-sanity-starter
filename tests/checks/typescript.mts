import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TYPES_FILE = path.join(ROOT, 'types', 'index.ts');
const SCHEMA_DIR = path.join(ROOT, 'studio', 'schemaTypes');

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkTypeScriptInterfaces() {
    const typesContent = await readFile(TYPES_FILE);

    // Check that all section types have interfaces
    const sectionTypes = [
        'heroCarouselSection',
        'storiesSection',
        'categoriesSection',
        'flashSaleSection',
        'featuredProductsSection',
        'supportSection'
    ];

    for (const sectionType of sectionTypes) {
        const interfaceName = sectionType.charAt(0).toUpperCase() + sectionType.slice(1);
        if (!typesContent.includes(`interface ${interfaceName}`) &&
            !typesContent.includes(`type ${interfaceName}`)) {
            throw new Error(`Missing TypeScript interface/type for ${sectionType}`);
        }
    }
}

export async function checkPageSectionsUnion() {
    const typesContent = await readFile(TYPES_FILE);

    if (!typesContent.includes('PageSections')) {
        throw new Error('Missing PageSections union type definition');
    }

    const sectionTypes = [
        'heroCarouselSection',
        'storiesSection',
        'categoriesSection',
        'flashSaleSection',
        'featuredProductsSection',
        'supportSection'
    ];

    for (const sectionType of sectionTypes) {
        const interfaceName = sectionType.charAt(0).toUpperCase() + sectionType.slice(1);
        if (!typesContent.includes(interfaceName)) {
            throw new Error(`${interfaceName} missing from PageSections union type`);
        }
    }
}

export async function checkCamelCaseFieldNames() {
    const typesContent = await readFile(TYPES_FILE);

    // Check for snake_case or kebab-case field names
    const invalidFieldPatterns = [
        /[a-z]+_[a-z]+/g,  // snake_case
        /[a-z]+-[a-z]+/g   // kebab-case
    ];

    for (const pattern of invalidFieldPatterns) {
        const matches = typesContent.match(pattern);
        if (matches) {
            throw new Error(`Found non-camelCase field names in types: ${matches.join(', ')}`);
        }
    }
}

export async function checkOptionalIdFields() {
    const typesContent = await readFile(TYPES_FILE);

    // Check that objects that need data-sb-object-id have optional _id fields
    const objectTypes = ['image', 'product', 'item', 'banner', 'story', 'category'];

    for (const objectType of objectTypes) {
        if (typesContent.includes(objectType) && !typesContent.includes(`_id?:`)) {
            // This is a soft check - not all objects need _id
            console.log(`Warning: ${objectType} objects may need optional _id fields for annotations`);
        }
    }
}

export async function checkTypeScriptCompliance() {
    await checkTypeScriptInterfaces();
    await checkPageSectionsUnion();
    await checkCamelCaseFieldNames();
    await checkOptionalIdFields();
}
