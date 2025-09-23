import { promises as fs } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

function resolveDist(distDir?: string) {
    return distDir ? path.resolve(distDir) : path.join(process.cwd(), 'dist');
}

async function loadHomepage(distDir?: string) {
    const distPath = resolveDist(distDir);
    const indexPath = path.join(distPath, 'index.html');
    try {
        const html = await fs.readFile(indexPath, 'utf8');
        return new JSDOM(html);
    } catch {
        throw new Error(`Astro build not found at ${indexPath}`);
    }
}

export async function checkPageWrapperHasObjectId(distDir?: string) {
    const dom = await loadHomepage(distDir);
    const wrapper = dom.window.document.querySelector('[data-sb-object-id]');
    if (!wrapper) {
        throw new Error('Missing data-sb-object-id on homepage wrapper');
    }
}

export async function checkSectionRootsHaveIndexes(distDir?: string) {
    const dom = await loadHomepage(distDir);
    const sections: HTMLElement[] = Array.from(
        dom.window.document.querySelectorAll<HTMLElement>('[data-sb-field-path^="sections."]')
    );

    if (sections.length === 0) {
        throw new Error('No sections found with data-sb-field-path="sections.{index}"');
    }

    const indexes = sections.map((section) => {
        const fieldPath = section.getAttribute('data-sb-field-path') ?? '';
        if (!/^sections\.\d+$/.test(fieldPath)) {
            throw new Error(`Section root has invalid data-sb-field-path: ${fieldPath}`);
        }
        return Number(fieldPath.split('.')[1]);
    });

    const expected = Array.from({ length: indexes.length }, (_, idx) => idx);
    const sorted = [...indexes].sort((a, b) => a - b);
    if (sorted.some((value, idx) => value !== expected[idx])) {
        throw new Error('Section indexes are not sequential starting from 0');
    }
}

export async function checkFieldLevelAnnotations(distDir?: string) {
    const dom = await loadHomepage(distDir);
    const sections = Array.from(
        dom.window.document.querySelectorAll('[data-sb-field-path^="sections."]')
    );

    for (const section of sections) {
        const element = section as HTMLElement;
        const sectionPath = element.getAttribute('data-sb-field-path');
        if (!sectionPath) continue;
        const annotated: HTMLElement[] = Array.from(
            element.querySelectorAll<HTMLElement>('[data-sb-field-path]')
        );
        const hasRelative = annotated.some((element) => {
            const value = element.getAttribute('data-sb-field-path') ?? '';
            return value !== sectionPath && value.startsWith('.');
        });
        if (!hasRelative) {
            throw new Error(`Section ${sectionPath} has no field-level annotations`);
        }

        const invalid = annotated.filter((element) => {
            const value = element.getAttribute('data-sb-field-path') ?? '';
            if (value === sectionPath) return false;
            return !value.startsWith('.');
        });

        if (invalid.length > 0) {
            throw new Error(
                `Section ${sectionPath} contains non-relative annotations: ${invalid
                    .map((el) => el.getAttribute('data-sb-field-path'))
                    .join(', ')}`
            );
        }
    }
}

export async function checkImageAnnotationRule(distDir?: string) {
    const dom = await loadHomepage(distDir);
    const images: HTMLImageElement[] = Array.from(dom.window.document.querySelectorAll<HTMLImageElement>('img'));
    for (const img of images) {
        const hasObjectId = img.hasAttribute('data-sb-object-id');
        const hasFieldPath = img.hasAttribute('data-sb-field-path');
        if (hasObjectId && hasFieldPath) {
            throw new Error('Image uses both data-sb-object-id and data-sb-field-path, expected a single annotation');
        }
        if (!hasObjectId && !hasFieldPath) {
            throw new Error('Image missing Stackbit annotation');
        }
    }
}
