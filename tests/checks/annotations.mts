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

export async function checkFieldNameMatching(distDir?: string) {
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

        for (const annotatedElement of annotated) {
            const fieldPath = annotatedElement.getAttribute('data-sb-field-path');
            if (!fieldPath || fieldPath === sectionPath) continue;

            // Check if field path starts with dot (relative)
            if (fieldPath.startsWith('.')) {
                const fieldName = fieldPath.substring(1);
                // Allow numeric indices for array items, otherwise check for camelCase
                if (!/^\d+$/.test(fieldName) && !/^[a-z][a-zA-Z0-9]*$/.test(fieldName)) {
                    throw new Error(`Field name "${fieldName}" in ${sectionPath} is not camelCase or numeric index`);
                }
            }
        }
    }
}

export async function checkArrayAnnotationRules(distDir?: string) {
    const dom = await loadHomepage(distDir);
    const sections = Array.from(
        dom.window.document.querySelectorAll('[data-sb-field-path^="sections."]')
    );

    for (const section of sections) {
        const element = section as HTMLElement;
        const sectionPath = element.getAttribute('data-sb-field-path');
        if (!sectionPath) continue;

        // Check for array containers with .items
        const arrayContainers = Array.from(
            element.querySelectorAll('[data-sb-field-path=".items"]')
        );

        for (const container of arrayContainers) {
            // Check that array items have proper indexing
            const items = Array.from(
                container.querySelectorAll('[data-sb-field-path^="."]')
            );

            for (let i = 0; i < items.length; i++) {
                const item = items[i] as HTMLElement;
                const itemPath = item.getAttribute('data-sb-field-path');
                if (itemPath && itemPath.startsWith('.')) {
                    const fieldName = itemPath.substring(1);
                    // Check if it's an array item (should be numeric or have proper structure)
                    if (!/^\d+$/.test(fieldName) && !fieldName.includes('.')) {
                        // This might be a field within an array item
                        continue;
                    }
                }
            }
        }
    }
}

export async function checkFieldPathHierarchy(distDir?: string) {
    const dom = await loadHomepage(distDir);
    const sections = Array.from(
        dom.window.document.querySelectorAll('[data-sb-field-path^="sections."]')
    );

    for (const section of sections) {
        const element = section as HTMLElement;
        const sectionPath = element.getAttribute('data-sb-field-path');
        if (!sectionPath) continue;

        // Check for proper field path hierarchy
        const allAnnotated = Array.from(
            element.querySelectorAll<HTMLElement>('[data-sb-field-path]')
        );

        for (const annotated of allAnnotated) {
            const fieldPath = annotated.getAttribute('data-sb-field-path');
            if (!fieldPath || fieldPath === sectionPath) continue;

            // Check for proper hierarchy patterns
            if (fieldPath.startsWith('.')) {
                const relativePath = fieldPath.substring(1);

                // Check for array item indexing pattern
                if (/^\d+$/.test(relativePath)) {
                    // This is an array item - check that it has proper structure
                    const itemFields = Array.from(
                        annotated.querySelectorAll<HTMLElement>('[data-sb-field-path]')
                    );

                    for (const itemField of itemFields) {
                        const itemFieldPath = itemField.getAttribute('data-sb-field-path');
                        if (itemFieldPath && itemFieldPath.startsWith('.')) {
                            const itemFieldName = itemFieldPath.substring(1);
                            // Item fields should be relative to the item
                            if (!/^[a-z][a-zA-Z0-9]*$/.test(itemFieldName)) {
                                throw new Error(`Invalid item field path: ${itemFieldPath} in ${sectionPath}`);
                            }
                        }
                    }
                }
            }
        }
    }
}