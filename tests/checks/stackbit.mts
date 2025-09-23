import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MODELS_DIR = path.join(ROOT, '.stackbit', 'models');
const SCHEMA_DIR = path.join(ROOT, 'studio', 'schemaTypes');
const BASE_FIELDS = new Set(['theme', 'width', 'backgroundImage']);

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkModelExists(sectionName: string) {
    const modelPath = path.join(MODELS_DIR, `${sectionName}.ts`);
    try {
        await fs.access(modelPath);
    } catch {
        throw new Error(`Stackbit model "${sectionName}" missing in .stackbit/models`);
    }
}

export async function checkModelNameMatchesSchema(sectionName: string) {
    const modelPath = path.join(MODELS_DIR, `${sectionName}.ts`);
    const content = await readFile(modelPath);
    if (!content.includes(`name: '${sectionName}'`)) {
        throw new Error(`Stackbit model name for "${sectionName}" does not match schema type`);
    }
}

export async function checkModelFieldsCoverSchema(sectionName: string) {
    const schemaPath = path.join(SCHEMA_DIR, `${sectionName}.ts`);
    const modelPath = path.join(MODELS_DIR, `${sectionName}.ts`);

    const [schemaSource, modelSource] = await Promise.all([readFile(schemaPath), readFile(modelPath)]);

    const schemaFields = new Set(
        [...schemaSource.matchAll(/defineField\(\{\s*name:\s*'([^']+)'/g)].map(([, name]) => name)
    );

    const modelFields = new Set(
        [...modelSource.matchAll(/name:\s*'([^']+)'/g)].map(([, name]) => name)
    );
    const hasCommonFields = modelSource.includes('...commonFields');

    const uncovered = Array.from(schemaFields).filter((field) => {
        if (BASE_FIELDS.has(field)) {
            return !hasCommonFields && !modelFields.has(field);
        }
        return !modelFields.has(field);
    });

    if (uncovered.length > 0) {
        throw new Error(
            `Stackbit model "${sectionName}" missing controls for: ${uncovered.map((field) => `"${field}"`).join(', ')}`
        );
    }
}
