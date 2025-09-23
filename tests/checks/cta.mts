import { promises as fs } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = process.cwd();
const CHECKOUT_CONFIG_PATH = path.join(ROOT, 'telegram-shop', 'lib', 'checkout-config.json');

async function loadCheckoutConfig() {
    const raw = await fs.readFile(CHECKOUT_CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw) as {
        basePath: string;
        paramConfig: { required: readonly string[] };
    };
    return parsed;
}

function resolveDist(distDir?: string) {
    return distDir ? path.resolve(distDir) : path.join(ROOT, 'dist');
}

export async function checkHomeCtasPointToCheckout(distDir?: string) {
    const dist = resolveDist(distDir);
    const indexPath = path.join(dist, 'index.html');
    const html = await fs.readFile(indexPath, 'utf8');
    const dom = new JSDOM(html);
    const { basePath, paramConfig } = await loadCheckoutConfig();

    const anchors: HTMLAnchorElement[] = Array.from(
        dom.window.document.querySelectorAll<HTMLAnchorElement>('a[data-sb-field-path]')
    );
    const CTA_FIELDS = new Set(['.url', '.buttonLink', '.actionLink']);
    const ctas = anchors.filter((anchor) => CTA_FIELDS.has(anchor.getAttribute('data-sb-field-path') ?? ''));

    if (ctas.length === 0) {
        throw new Error('No annotated CTAs found on homepage');
    }

    for (const cta of ctas) {
        const href = cta.getAttribute('href');
        if (!href) {
            throw new Error('CTA link missing href attribute');
        }
        const url = new URL(href, 'https://example.com');
        if (!url.pathname.endsWith(basePath)) {
            throw new Error(`CTA link expected to target checkout path ${basePath}, received ${url.pathname}`);
        }
        for (const param of paramConfig.required) {
            if (!url.searchParams.has(param)) {
                throw new Error(`CTA link missing required "${param}" param`);
            }
        }
    }
}
