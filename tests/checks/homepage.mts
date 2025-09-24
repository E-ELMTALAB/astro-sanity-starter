import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const SLUG_FILE = path.join(PAGES_DIR, '[...slug].astro');

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkNoStaticIndex() {
    const indexPath = path.join(PAGES_DIR, 'index.astro');
    try {
        await fs.access(indexPath);
        throw new Error('Static src/pages/index.astro exists - should be deleted to let [...slug].astro handle root route');
    } catch {
        // File doesn't exist - this is good
    }
}

export async function checkSlugHandlesRootRoute() {
    const content = await readFile(SLUG_FILE);

    // Check for homepage detection
    if (!content.includes("slug === '/'") && !content.includes("slug.current === '/'")) {
        throw new Error('[...slug].astro does not detect homepage (slug === "/")');
    }
}

export async function checkCustomComponentRendering() {
    const content = await readFile(SLUG_FILE);

    // Check for custom component import and usage
    if (!content.includes('TelegramShopHome')) {
        throw new Error('[...slug].astro does not import or use TelegramShopHome component');
    }
}

export async function checkSectionFinding() {
    const content = await readFile(SLUG_FILE);

    // Check for section finding logic
    if (!content.includes('findSection')) {
        throw new Error('[...slug].astro does not have findSection function');
    }

    // Check for section field path passing
    const sectionTypes = ['stories', 'heroCarousel', 'categories', 'flashSale', 'featured', 'support'];
    for (const sectionType of sectionTypes) {
        const fieldPathProp = `${sectionType}FieldPath`;
        if (!content.includes(fieldPathProp)) {
            throw new Error(`Missing ${fieldPathProp} in [...slug].astro`);
        }
    }
}

export async function checkPageWrapperObjectId() {
    const content = await readFile(SLUG_FILE);

    // Check for page wrapper with data-sb-object-id
    if (!content.includes('data-sb-object-id={_id}')) {
        throw new Error('[...slug].astro does not wrap content with data-sb-object-id={_id}');
    }
}

export async function checkHomepageIntegration() {
    await checkNoStaticIndex();
    await checkSlugHandlesRootRoute();
    await checkCustomComponentRendering();
    await checkSectionFinding();
    await checkPageWrapperObjectId();
}
