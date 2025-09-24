import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const TYPES_FILE = path.join(ROOT, 'types', 'index.ts');

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkReactComponentProps() {
    const telegramShopFile = path.join(COMPONENTS_DIR, 'TelegramShopHome.tsx');
    const content = await readFile(telegramShopFile);

    // Check that props interface extends section types
    if (!content.includes('extends') && !content.includes('interface TelegramShopHomeProps')) {
        throw new Error('TelegramShopHome component props interface does not extend section types');
    }

    // Check for data-sb-field-path extraction
    if (!content.includes('data-sb-field-path')) {
        throw new Error('TelegramShopHome component does not handle data-sb-field-path props');
    }
}

export async function checkAstroComponentProps() {
    const astroComponents = ['Action.astro', 'ActionButton.astro', 'ActionLink.astro', 'Header.astro', 'Footer.astro'];

    for (const component of astroComponents) {
        const componentPath = path.join(COMPONENTS_DIR, component);
        const content = await readFile(componentPath);

        // Check for data-sb-field-path handling
        if (!content.includes('data-sb-field-path')) {
            throw new Error(`${component} does not handle data-sb-field-path props`);
        }
    }
}

export async function checkComponentFieldPathPassing() {
    const telegramShopFile = path.join(COMPONENTS_DIR, 'TelegramShopHome.tsx');
    const content = await readFile(telegramShopFile);

    // Check that field paths are passed to section wrappers
    const sectionTypes = ['stories', 'heroCarousel', 'categories', 'flashSale', 'featured', 'support'];

    for (const sectionType of sectionTypes) {
        const fieldPathProp = `${sectionType}FieldPath`;
        if (!content.includes(fieldPathProp)) {
            throw new Error(`Missing ${fieldPathProp} prop in TelegramShopHome component`);
        }
    }
}

export async function checkComponentArchitecture() {
    await checkReactComponentProps();
    await checkAstroComponentProps();
    await checkComponentFieldPathPassing();
}
