import { promises as fs } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

function resolveDist(distDir?: string) {
    return distDir ? path.resolve(distDir) : path.join(process.cwd(), 'dist');
}

async function loadDomAndPage(distDir?: string) {
    const distPath = resolveDist(distDir);
    const indexPath = path.join(distPath, 'index.html');
    const html = await fs.readFile(indexPath, 'utf8');
    const dom = new JSDOM(html);
    const script = dom.window.document.querySelector('#__page');
    if (!script) {
        throw new Error('Missing embedded page JSON script with id="__page"');
    }
    const json = script.textContent || '';
    let page: any;
    try {
        page = JSON.parse(json);
    } catch (err) {
        const preview = json.slice(0, 200).replace(/\s+/g, ' ');
        const reason = err instanceof Error ? err.message : String(err);
        throw new Error(
            `Failed to parse embedded page JSON: ${reason}\n` +
            `Preview (first 200 chars): ${preview}\n` +
            `Total length: ${json.length}`
        );
    }
    return { dom, page };
}

function get(obj: any, pathParts: Array<string | number>) {
    return pathParts.reduce<any>((acc, part) => (acc == null ? undefined : (acc as any)[part as any]), obj);
}

function resolveRelativePath(base: any, relPath: string) {
    // relPath like ".subtitle", ".items", ".0", ".items.0.name"
    const parts = relPath
        .replace(/^\./, '')
        .split('.')
        .filter(Boolean)
        .map((p) => (/^\d+$/.test(p) ? Number(p) : p));
    return get(base, parts as any);
}

function getEffectiveRelativePath(element: HTMLElement, root: HTMLElement, rootPath: string): string {
    // Build ancestor parts from root -> element (excluding root)
    const chain: string[] = [];
    let node: HTMLElement | null = element.parentElement as HTMLElement | null;
    while (node && node !== root) {
        const rel = node.getAttribute('data-sb-field-path') ?? '';
        if (rel && rel !== rootPath && rel.startsWith('.')) {
            const parts = rel.replace(/^\./, '').split('.').filter(Boolean);
            // unshift so order is from root -> element
            chain.unshift(...parts);
        }
        node = node.parentElement as HTMLElement | null;
    }
    // Extract container/index pairs from the chain (e.g., banners.0, items.3, slides.1)
    const baseParts: (string | number)[] = [];
    for (let i = 0; i < chain.length - 1; i++) {
        const a = chain[i];
        const b = chain[i + 1];
        if (/^\d+$/.test(b)) {
            baseParts.push(a, Number(b));
            i++; // skip the index we just consumed
        }
    }
    // Current element rel parts
    const selfRel = element.getAttribute('data-sb-field-path') ?? '';
    const selfParts = selfRel.replace(/^\./, '').split('.').filter(Boolean);

    // If element path starts with a numeric index (e.g., ".0"), prepend the nearest container ancestor (e.g., ".banners" or ".items")
    let prefix: (string | number)[] = [];
    if (selfParts.length > 0 && /^\d+$/.test(String(selfParts[0]))) {
        let container: string | undefined;
        let node: HTMLElement | null = element.parentElement as HTMLElement | null;
        while (node && node !== root) {
            const rel = node.getAttribute('data-sb-field-path') ?? '';
            if (/^\.[a-z][a-zA-Z0-9]*$/.test(rel)) {
                container = rel.slice(1);
                break;
            }
            node = node.parentElement as HTMLElement | null;
        }
        if (container) {
            prefix = [container];
        }
    }

    // Ignore any preceding leaf-field ancestors like buttonLink; rely on container/index pairs only
    const effectiveParts = [...prefix, ...baseParts, ...selfParts];
    return effectiveParts.length ? `.${effectiveParts.join('.')}` : '';
}

export async function checkAnnotationResolution(distDir?: string) {
    const { dom, page } = await loadDomAndPage(distDir);

    if (!page || !Array.isArray(page.sections)) {
        throw new Error('Embedded page JSON missing sections array');
    }

    const sectionRoots: HTMLElement[] = Array.from(
        dom.window.document.querySelectorAll<HTMLElement>('[data-sb-field-path^="sections."]')
    );

    for (const root of sectionRoots) {
        const fieldPath = root.getAttribute('data-sb-field-path') ?? '';
        const match = fieldPath.match(/^sections\.(\d+)$/);
        if (!match) {
            const snippet = root.outerHTML.slice(0, 120).replace(/\s+/g, ' ');
            throw new Error(`Invalid section root path: ${fieldPath} in node: ${snippet}...`);
        }
        const index = Number(match[1]);
        const sectionData = page.sections[index];
        if (!sectionData) {
            throw new Error(
                `Section data missing at index ${index} for ${fieldPath}. ` +
                `Available sections: ${Array.isArray(page.sections) ? page.sections.length : 'N/A'}`
            );
        }

        const annotated: HTMLElement[] = Array.from(
            root.querySelectorAll<HTMLElement>('[data-sb-field-path]')
        );
        for (const el of annotated) {
            const rel = el.getAttribute('data-sb-field-path') ?? '';
            if (!rel || rel === fieldPath) continue; // skip the root itself
            if (!rel.startsWith('.')) continue; // only validate relative paths here

            // Build the effective path by joining ancestor rels
            const ancestorRel = getEffectiveRelativePath(el, root, fieldPath);
            const effectiveRel = ancestorRel || rel; // fallback to self rel

            const resolved = resolveRelativePath(sectionData, effectiveRel);
            if (resolved === undefined) {
                const keys = sectionData && typeof sectionData === 'object' ? Object.keys(sectionData) : [];
                throw new Error(
                    `Field path ${fieldPath}${effectiveRel} not found in page JSON. ` +
                    `Top-level keys for ${fieldPath}: ${keys.join(', ')}`
                );
            }

            // For arrays (generic): ensure container is array and items exist when annotated
            if (Array.isArray(resolved)) {
                const itemNodesAll: HTMLElement[] = Array.from(
                    el.querySelectorAll<HTMLElement>('[data-sb-field-path^="."]')
                );
                const itemNodes: HTMLElement[] = itemNodesAll.filter((node: HTMLElement) =>
                    /^\.\d+$/.test(node.getAttribute('data-sb-field-path') ?? '')
                );

                for (const itemNode of itemNodes) {
                    const itemRel = itemNode.getAttribute('data-sb-field-path')!; // like ".0"
                    const itemIdx = Number(itemRel.slice(1));
                    if (Number.isNaN(itemIdx) || !(itemIdx in resolved)) {
                        throw new Error(
                            `Annotated array item ${fieldPath}${effectiveRel}${itemRel} out of bounds. ` +
                            `length = ${resolved.length}`
                        );
                    }
                }
            }
        }
    }
}


