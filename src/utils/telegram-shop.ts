const baseEnv = (import.meta.env['PUBLIC_TELEGRAM_SHOP_BASE_URL'] as string | undefined) ?? '/telegram-shop';
const normalizedBase = baseEnv.endsWith('/') ? baseEnv.slice(0, -1) : baseEnv;

export function buildCheckoutUrl(productSlug?: string | null, variantSku?: string | null): string | undefined {
    if (!productSlug) {
        return undefined;
    }

    const params = new URLSearchParams({ product: productSlug });
    if (variantSku) {
        params.set('variant', variantSku);
    }

    const prefix = normalizedBase === '/' ? '' : normalizedBase;
    return `${prefix}/checkout?${params.toString()}`;
}
