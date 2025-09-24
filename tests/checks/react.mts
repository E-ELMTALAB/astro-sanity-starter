import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ASTRO_CONFIG = path.join(ROOT, 'astro.config.mjs');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkAstroReactIntegration() {
    const content = await readFile(ASTRO_CONFIG);

    if (!content.includes('@astrojs/react')) {
        throw new Error('@astrojs/react not found in astro.config.mjs integrations');
    }
}

export async function checkReactImports() {
    const telegramShopFile = path.join(COMPONENTS_DIR, 'TelegramShopHome.tsx');
    const content = await readFile(telegramShopFile);

    // Check for explicit React import
    if (!content.includes("import React") && !content.includes("import * as React")) {
        throw new Error('TelegramShopHome.tsx does not have explicit React import');
    }
}

export async function checkNullishCoalescing() {
    const telegramShopFile = path.join(COMPONENTS_DIR, 'TelegramShopHome.tsx');
    const content = await readFile(telegramShopFile);

    // Check for nullish coalescing operator usage
    if (!content.includes('??')) {
        throw new Error('TelegramShopHome.tsx does not use nullish coalescing (??) for CMS fallbacks');
    }
}

export async function checkClientDirective() {
    const slugFile = path.join(ROOT, 'src', 'pages', '[...slug].astro');
    const content = await readFile(slugFile);

    // Check for client:load directive
    if (!content.includes('client:load')) {
        throw new Error('TelegramShopHome component not used with client:load directive');
    }
}

export async function checkStaticArrayRenaming() {
    const telegramShopFile = path.join(COMPONENTS_DIR, 'TelegramShopHome.tsx');
    const content = await readFile(telegramShopFile);

    // Check for renamed static arrays to avoid name conflicts
    const staticArrayPatterns = [
        'STATIC_STORIES',
        'STATIC_ITEMS',
        'STATIC_BANNERS',
        'STATIC_CATEGORIES'
    ];

    let hasRenamedArrays = false;
    for (const pattern of staticArrayPatterns) {
        if (content.includes(pattern)) {
            hasRenamedArrays = true;
            break;
        }
    }

    // This is a soft check - not all projects need renamed arrays
    if (!hasRenamedArrays) {
        console.log('Warning: Consider renaming static arrays to avoid name conflicts (e.g., STATIC_STORIES)');
    }
}

export async function checkReactSetup() {
    await checkAstroReactIntegration();
    await checkReactImports();
    await checkNullishCoalescing();
    await checkClientDirective();
    await checkStaticArrayRenaming();
}
