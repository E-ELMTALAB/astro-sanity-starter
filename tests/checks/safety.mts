import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src', 'data');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');

async function readFile(filePath: string) {
    return fs.readFile(filePath, 'utf8');
}

export async function checkSanityErrorHandling() {
    const pageFile = path.join(DATA_DIR, 'page.js');
    const siteConfigFile = path.join(DATA_DIR, 'siteConfig.js');

    const [pageContent, siteConfigContent] = await Promise.all([
        readFile(pageFile),
        readFile(siteConfigFile)
    ]);

    // Check for try/catch around Sanity fetches
    if (!pageContent.includes('try') || !pageContent.includes('catch')) {
        throw new Error('page.js does not have try/catch around Sanity fetches');
    }

    if (!siteConfigContent.includes('try') || !siteConfigContent.includes('catch')) {
        throw new Error('siteConfig.js does not have try/catch around Sanity fetches');
    }
}

export async function checkImageErrorHandling() {
    const responsiveImageFile = path.join(COMPONENTS_DIR, 'ResponsiveImage.astro');
    const content = await readFile(responsiveImageFile);

    // Check for image error handling or fallback
    if (!content.includes('placeholder.svg') && !content.includes('onError')) {
        throw new Error('ResponsiveImage component does not have error handling or fallback');
    }
}

export async function checkConditionalRendering() {
    const telegramShopFile = path.join(COMPONENTS_DIR, 'TelegramShopHome.tsx');
    const content = await readFile(telegramShopFile);

    // Check for conditional rendering patterns
    const conditionalPatterns = [
        '&&',
        '?',
        '??',
        'if (',
        'optional'
    ];

    let hasConditionalRendering = false;
    for (const pattern of conditionalPatterns) {
        if (content.includes(pattern)) {
            hasConditionalRendering = true;
            break;
        }
    }

    if (!hasConditionalRendering) {
        throw new Error('TelegramShopHome component does not use conditional rendering for optional fields');
    }
}

export async function checkFallbackData() {
    const fallbackFile = path.join(DATA_DIR, 'fallback.js');
    const content = await readFile(fallbackFile);

    // Check for fallback data structure
    if (!content.includes('fallbackPages') || !content.includes('fallbackSiteConfig')) {
        throw new Error('Fallback data structure missing or incomplete');
    }
}

export async function checkDeploymentSafety() {
    await checkSanityErrorHandling();
    await checkImageErrorHandling();
    await checkConditionalRendering();
    await checkFallbackData();
}
