import fg from 'fast-glob';
import path from 'node:path';
import { promises as fs } from 'node:fs';

const ROOT = process.cwd();

const LEGACY_FILE_PATTERNS = [
    'src/components/Hero.astro',
    'src/components/Cards.astro',
    'src/components/Cta.astro',
    'src/components/Testimonials.astro',
    'src/components/Logos.astro',
    'src/components/LogoStrip*.astro',
    'src/components/ProductCard.astro',
    'src/components/Testimonial.astro',
    'src/components/Card.astro',
    'src/components/BackgroundImage.astro',
    'studio/schemaTypes/cardsSection.ts',
    'studio/schemaTypes/ctaSection.ts',
    'studio/schemaTypes/heroSection.ts',
    'studio/schemaTypes/logosSection.ts',
    'studio/schemaTypes/testimonialsSection.ts',
    '.stackbit/models/cardsSection.ts',
    '.stackbit/models/ctaSection.ts',
    '.stackbit/models/heroSection.ts',
    '.stackbit/models/logosSection.ts',
    '.stackbit/models/testimonialsSection.ts'
];

const LEGACY_IDENTIFIERS = [
    /\bHeroSection\b/,
    /\bcardsSection\b/,
    /\bctaSection\b/,
    /\blogosSection\b/,
    /\btestimonialsSection\b/,
    /@components\/Hero/,
    /@components\/Cards/,
    /@components\/Testimonials/,
    /@components\/Logos/
];

const SCAN_GLOBS = ['src/**/*.{astro,ts,tsx,js,jsx}', 'studio/**/*.ts', '.stackbit/**/*.ts'];

export async function checkNoLegacyStarterArtifacts() {
    for (const pattern of LEGACY_FILE_PATTERNS) {
        const matches = await fg(pattern, { cwd: ROOT, dot: true });
        if (matches.length > 0) {
            throw new Error(`Legacy starter artifact found: ${matches[0]}`);
        }
    }

    const files = await fg(SCAN_GLOBS, { cwd: ROOT, dot: false });
    for (const relative of files) {
        const filePath = path.join(ROOT, relative);
        const content = await fs.readFile(filePath, 'utf8');
        for (const pattern of LEGACY_IDENTIFIERS) {
            if (pattern.test(content)) {
                throw new Error(`Legacy starter artifact found: ${relative}`);
            }
        }
    }
}
