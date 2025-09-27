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
    console.log('🔍 Running Sanity CMS Tests...');
    const sanityChecks = await import('./checks/sanity.mts');
    const sections = getSections();

    for (const section of sections) {
        console.log(`  📋 Testing section: ${section}`);

        try {
            await sanityChecks.checkSchemaExists(section);
            console.log(`    ✅ Schema exists: ${section}`);
        } catch (error) {
            console.log(`    ❌ Schema missing: ${section}`);
            throw error;
        }

        try {
            await sanityChecks.checkSectionRegisteredInPage(section);
            console.log(`    ✅ Section registered in page: ${section}`);
        } catch (error) {
            console.log(`    ❌ Section not registered: ${section}`);
            throw error;
        }

        try {
            await sanityChecks.checkSchemaRegisteredInIndex(section);
            console.log(`    ✅ Schema registered in index: ${section}`);
        } catch (error) {
            console.log(`    ❌ Schema not registered in index: ${section}`);
            throw error;
        }

        try {
            await sanityChecks.checkSchemaStructure(section);
            console.log(`    ✅ Schema structure valid: ${section}`);
        } catch (error) {
            console.log(`    ❌ Schema structure invalid: ${section}`);
            throw error;
        }

        try {
            await sanityChecks.checkNestedObjectSchemas(section);
            console.log(`    ✅ Nested object schemas valid: ${section}`);
        } catch (error) {
            console.log(`    ❌ Nested object schemas invalid: ${section}`);
            throw error;
        }

        try {
            await sanityChecks.checkGroqProjectsIdsAndImages(section);
            console.log(`    ✅ GROQ projection valid: ${section}`);
        } catch (error) {
            console.log(`    ❌ GROQ projection invalid: ${section}`);
            throw error;
        }

        try {
            await sanityChecks.checkGroqImageProjections(section);
            console.log(`    ✅ GROQ image projections valid: ${section}`);
        } catch (error) {
            console.log(`    ❌ GROQ image projections invalid: ${section}`);
            throw error;
        }
    }
    console.log('✅ All Sanity tests passed!\n');
}

async function runStackbitChecks() {
    console.log('🎨 Running Stackbit Tests...');
    const stackbitChecks = await import('./checks/stackbit.mts');
    const sections = getSections();

    for (const section of sections) {
        console.log(`  📋 Testing section: ${section}`);

        try {
            await stackbitChecks.checkModelExists(section);
            console.log(`    ✅ Model exists: ${section}`);
        } catch (error) {
            console.log(`    ❌ Model missing: ${section}`);
            throw error;
        }

        try {
            await stackbitChecks.checkModelNameMatchesSchema(section);
            console.log(`    ✅ Model name matches: ${section}`);
        } catch (error) {
            console.log(`    ❌ Model name mismatch: ${section}`);
            throw error;
        }

        try {
            await stackbitChecks.checkModelImportsCommonFields(section);
            console.log(`    ✅ Model imports commonFields: ${section}`);
        } catch (error) {
            console.log(`    ❌ Model missing commonFields: ${section}`);
            throw error;
        }

        try {
            await stackbitChecks.checkModelRegisteredInIndex(section);
            console.log(`    ✅ Model registered in index: ${section}`);
        } catch (error) {
            console.log(`    ❌ Model not registered in index: ${section}`);
            throw error;
        }

        try {
            await stackbitChecks.checkModelFieldsCoverSchema(section);
            console.log(`    ✅ Model fields complete: ${section}`);
        } catch (error) {
            console.log(`    ❌ Model fields incomplete: ${section}`);
            throw error;
        }
    }
    console.log('✅ All Stackbit tests passed!\n');
}

async function runRenderChecks() {
    console.log('🎯 Running Render Tests...');
    const annotationChecks = await import('./checks/annotations.mts');
    const resolutionChecks = await import('./checks/annotation-resolution.mts');
    const ctaChecks = await import('./checks/cta.mts');
    const distDir = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : undefined;

    try {
        await annotationChecks.checkPageWrapperHasObjectId(distDir);
        console.log('  ✅ Page wrapper has object ID');
    } catch (error) {
        console.log('  ❌ Page wrapper missing object ID');
        throw error;
    }

    try {
        await annotationChecks.checkSectionRootsHaveIndexes(distDir);
        console.log('  ✅ Section roots have proper indexes');
    } catch (error) {
        console.log('  ❌ Section roots missing proper indexes');
        throw error;
    }

    try {
        await annotationChecks.checkFieldLevelAnnotations(distDir);
        console.log('  ✅ Field level annotations valid');
    } catch (error) {
        console.log('  ❌ Field level annotations invalid');
        throw error;
    }

    try {
        await annotationChecks.checkFieldNameMatching(distDir);
        console.log('  ✅ Field names match schema (camelCase)');
    } catch (error) {
        console.log('  ❌ Field names do not match schema');
        throw error;
    }

    try {
        await annotationChecks.checkArrayAnnotationRules(distDir);
        console.log('  ✅ Array annotation rules valid');
    } catch (error) {
        console.log('  ❌ Array annotation rules invalid');
        throw error;
    }

    try {
        await annotationChecks.checkFieldPathHierarchy(distDir);
        console.log('  ✅ Field path hierarchy valid');
    } catch (error) {
        console.log('  ❌ Field path hierarchy invalid');
        throw error;
    }

    try {
        await annotationChecks.checkImageAnnotationRule(distDir);
        console.log('  ✅ Image annotation rules valid');
    } catch (error) {
        console.log('  ❌ Image annotation rules invalid');
        throw error;
    }

    try {
        await resolutionChecks.checkAnnotationResolution(distDir);
        console.log('  ✅ Annotation resolution to page JSON valid');
    } catch (error) {
        console.log('  ❌ Annotation resolution invalid');
        throw error;
    }

    try {
        await ctaChecks.checkHomeCtasPointToCheckout(distDir);
        console.log('  ✅ CTA links point to checkout');
    } catch (error) {
        console.log('  ❌ CTA links invalid');
        throw error;
    }

    console.log('✅ All render tests passed!\n');
}

async function runLegacyChecks() {
    console.log('🧹 Running Legacy Cleanup Tests...');
    const legacyChecks = await import('./checks/legacy.mts');

    try {
        await legacyChecks.checkNoLegacyStarterArtifacts();
        console.log('  ✅ No legacy starter artifacts found');
        console.log('✅ All legacy tests passed!\n');
    } catch (error) {
        console.log('  ❌ Legacy starter artifacts found');
        throw error;
    }
}

async function runTypeScriptChecks() {
    console.log('📝 Running TypeScript Tests...');
    const typescriptChecks = await import('./checks/typescript.mts');

    try {
        await typescriptChecks.checkTypeScriptCompliance();
        console.log('  ✅ TypeScript compliance valid');
    } catch (error) {
        console.log('  ❌ TypeScript compliance invalid');
        throw error;
    }

    console.log('✅ All TypeScript tests passed!\n');
}

async function runComponentChecks() {
    console.log('🧩 Running Component Architecture Tests...');
    const componentChecks = await import('./checks/components.mts');

    try {
        await componentChecks.checkComponentArchitecture();
        console.log('  ✅ Component architecture valid');
    } catch (error) {
        console.log('  ❌ Component architecture invalid');
        throw error;
    }

    console.log('✅ All component tests passed!\n');
}

async function runHomepageChecks() {
    console.log('🏠 Running Homepage Integration Tests...');
    const homepageChecks = await import('./checks/homepage.mts');

    try {
        await homepageChecks.checkHomepageIntegration();
        console.log('  ✅ Homepage integration valid');
    } catch (error) {
        console.log('  ❌ Homepage integration invalid');
        throw error;
    }

    console.log('✅ All homepage tests passed!\n');
}

async function runReactChecks() {
    console.log('⚛️ Running React Setup Tests...');
    const reactChecks = await import('./checks/react.mts');

    try {
        await reactChecks.checkReactSetup();
        console.log('  ✅ React setup valid');
    } catch (error) {
        console.log('  ❌ React setup invalid');
        throw error;
    }

    console.log('✅ All React tests passed!\n');
}

async function runContentChecks() {
    console.log('📄 Running Content Requirements Tests...');
    const contentChecks = await import('./checks/content.mts');

    try {
        await contentChecks.checkContentRequirements();
        console.log('  ✅ Content requirements valid');
    } catch (error) {
        console.log('  ❌ Content requirements invalid');
        throw error;
    }

    console.log('✅ All content tests passed!\n');
}

async function runSafetyChecks() {
    console.log('🛡️ Running Deployment Safety Tests...');
    const safetyChecks = await import('./checks/safety.mts');

    try {
        await safetyChecks.checkDeploymentSafety();
        console.log('  ✅ Deployment safety valid');
    } catch (error) {
        console.log('  ❌ Deployment safety invalid');
        throw error;
    }

    console.log('✅ All safety tests passed!\n');
}

async function main() {
    const mode = process.argv[2];
    console.log(`🚀 Starting test suite: ${mode.toUpperCase()}\n`);

    try {
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
            case 'typescript':
                await runTypeScriptChecks();
                break;
            case 'components':
                await runComponentChecks();
                break;
            case 'homepage':
                await runHomepageChecks();
                break;
            case 'react':
                await runReactChecks();
                break;
            case 'content':
                await runContentChecks();
                break;
            case 'safety':
                await runSafetyChecks();
                break;
            case 'all':
                await runSanityChecks();
                await runStackbitChecks();
                await runTypeScriptChecks();
                await runComponentChecks();
                await runHomepageChecks();
                await runReactChecks();
                await runContentChecks();
                await runSafetyChecks();
                await runLegacyChecks();
                await runRenderChecks();
                break;
            default:
                throw new Error('Usage: node tests/run.mts <sanity|stackbit|render|legacy|typescript|components|homepage|react|content|safety|all>');
        }

        console.log('🎉 ALL TESTS PASSED! 🎉');
        console.log('✨ Your project is ready to go!');

    } catch (error) {
        console.log('\n💥 TESTS FAILED! 💥');
        console.log('❌ Please fix the issues above before continuing.');
        throw error;
    }
}

main().catch((error) => {
    const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : inspect(error, { depth: 5 });
    console.error(message);
    process.exit(1);
});
