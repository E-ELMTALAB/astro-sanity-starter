import process from 'node:process';
import path from 'node:path';
import { inspect } from 'node:util';

const DEFAULT_SECTIONS = [
    'heroCarouselSection',
    'storiesSection',
    'categoriesSection',
    'flashSaleSection',
    'featuredProductsSection',
    'supportSection'
];

function getSections() {
    const specific = process.env.SECTION?.trim();
    return specific ? [specific] : DEFAULT_SECTIONS;
}

async function runSanityChecks() {
    const sanityChecks = await import('./checks/sanity.mts');
    const sections = getSections();
    for (const section of sections) {
        await sanityChecks.checkSchemaExists(section);
        await sanityChecks.checkSectionRegisteredInPage(section);
        await sanityChecks.checkGroqProjectsIdsAndImages(section);
    }
}

async function runStackbitChecks() {
    const stackbitChecks = await import('./checks/stackbit.mts');
    const sections = getSections();
    for (const section of sections) {
        await stackbitChecks.checkModelExists(section);
        await stackbitChecks.checkModelNameMatchesSchema(section);
        await stackbitChecks.checkModelFieldsCoverSchema(section);
    }
}

async function runRenderChecks() {
    const annotationChecks = await import('./checks/annotations.mts');
    const ctaChecks = await import('./checks/cta.mts');
    const distDir = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : undefined;
    await annotationChecks.checkPageWrapperHasObjectId(distDir);
    await annotationChecks.checkSectionRootsHaveIndexes(distDir);
    await annotationChecks.checkFieldLevelAnnotations(distDir);
    await annotationChecks.checkImageAnnotationRule(distDir);
    await ctaChecks.checkHomeCtasPointToCheckout(distDir);
}

async function runLegacyChecks() {
    const legacyChecks = await import('./checks/legacy.mts');
    await legacyChecks.checkNoLegacyStarterArtifacts();
}

async function main() {
    const mode = process.argv[2];
    switch (mode) {
        case 'sanity':
            await runSanityChecks();
            break;
        case 'stackbit':
            await runStackbitChecks();
            break;
        case 'render':
            await runRenderChecks();
            break;
        case 'legacy':
            await runLegacyChecks();
            break;
        case 'all':
            await runSanityChecks();
            await runStackbitChecks();
            await runLegacyChecks();
            await runRenderChecks();
            break;
        default:
            throw new Error('Usage: node tests/run.mts <sanity|stackbit|render|legacy|all>');
    }
}

main().catch((error) => {
    const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : inspect(error, { depth: 5 });
    console.error(message);
    process.exit(1);
});
