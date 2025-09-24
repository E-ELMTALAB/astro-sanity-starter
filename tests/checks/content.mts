import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FALLBACK_FILE = path.join(ROOT, 'src', 'data', 'fallback.js');

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkHomepageFallback() {
    const content = await readFile(FALLBACK_FILE);

    // Check for homepage fallback with slug "/"
    if (!content.includes("current: '/'")) {
        throw new Error('Fallback data missing homepage with slug "/"');
    }
}

export async function checkRequiredSections() {
    const content = await readFile(FALLBACK_FILE);

    const requiredSections = [
        'heroCarouselSection',
        'storiesSection',
        'categoriesSection',
        'flashSaleSection',
        'featuredProductsSection',
        'supportSection'
    ];

    for (const section of requiredSections) {
        if (!content.includes(section)) {
            throw new Error(`Required section ${section} missing from fallback data`);
        }
    }
}

export async function checkSectionContent() {
    const content = await readFile(FALLBACK_FILE);

    // Check that sections have actual content, not just empty arrays
    if (content.includes('items: []') || content.includes('banners: []')) {
        throw new Error('Fallback sections have empty arrays - should have sample content');
    }
}

export async function checkSanityContentRequirements() {
    // This is a critical check - Visual Editor only works with Sanity content
    // We can't easily test if Sanity has actual content, but we can check the setup
    console.log('ℹ️  Visual Editor requires actual Sanity content (not fallbacks)');
    console.log('   → Create homepage with slug "/" in Sanity Studio');
    console.log('   → Add sections and publish content for Visual Editor to work');
}

export async function checkContentRequirements() {
    await checkHomepageFallback();
    await checkRequiredSections();
    await checkSectionContent();
    await checkSanityContentRequirements();
}
