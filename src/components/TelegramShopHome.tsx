import React, { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    Headset,
    LifeBuoy,
    Mail,
    MessageCircle,
    Phone,
    Star
} from 'lucide-react';
import type {
    CategoriesSection,
    FeaturedProductsSection,
    FlashSaleSection,
    HeroCarouselSection,
    StoriesSection,
    SupportSection
} from 'types';

interface TelegramShopHomeProps {
    stories?: StoriesSection | null;
    storiesFieldPath?: string;
    heroCarousel?: HeroCarouselSection | null;
    heroCarouselFieldPath?: string;
    categories?: CategoriesSection | null;
    categoriesFieldPath?: string;
    flashSale?: FlashSaleSection | null;
    flashSaleFieldPath?: string;
    featured?: FeaturedProductsSection | null;
    featuredFieldPath?: string;
    support?: SupportSection | null;
    supportFieldPath?: string;
    checkoutBaseUrl?: string;
    checkoutProductParam?: string;
    checkoutVariantParam?: string;
}

interface ActiveStoryState {
    storyIndex: number;
    slideIndex: number;
}

const DEFAULT_PRODUCT_PARAM = 'product';
const DEFAULT_VARIANT_PARAM = 'variant';

const supportIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    phone: Phone,
    call: Phone,
    mail: Mail,
    email: Mail,
    message: MessageCircle,
    chat: MessageCircle,
    support: LifeBuoy,
    help: LifeBuoy,
    headset: Headset,
    agent: Headset
};

function buildCheckoutHref(
    baseUrl: string | undefined,
    productSlug: string | undefined,
    variantSku: string | undefined,
    productParam?: string,
    variantParam?: string,
    quantity?: number
) {
    if (!baseUrl || !productSlug) {
        return undefined;
    }
    const [withoutHash, hash = ''] = baseUrl.split('#');
    const [path, existingQuery = ''] = withoutHash.split('?');
    const params = new URLSearchParams(existingQuery);
    params.set(productParam || DEFAULT_PRODUCT_PARAM, productSlug);
    const resolvedVariantParam = variantParam || DEFAULT_VARIANT_PARAM;
    if (variantSku) {
        params.set(resolvedVariantParam, variantSku);
    } else {
        params.delete(resolvedVariantParam);
    }
    if (quantity) {
        params.set('quantity', String(quantity));
    }
    const query = params.toString();
    const hashFragment = hash ? `#${hash}` : '';
    return query ? `${path}?${query}${hashFragment}` : `${path}${hashFragment}`;
}

function formatPrice(value?: number) {
    if (typeof value !== 'number') {
        return undefined;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }).format(value);
}

function renderMarkdown(value?: string) {
    if (!value) {
        return undefined;
    }
    return { __html: marked.parse(value) };
}

export default function TelegramShopHome({
    stories,
    storiesFieldPath,
    heroCarousel,
    heroCarouselFieldPath,
    categories,
    categoriesFieldPath,
    flashSale,
    flashSaleFieldPath,
    featured,
    featuredFieldPath,
    support,
    supportFieldPath,
    checkoutBaseUrl,
    checkoutProductParam,
    checkoutVariantParam
}: TelegramShopHomeProps) {
    const heroBanners = useMemo(() => heroCarousel?.banners?.filter(Boolean) ?? [], [heroCarousel?.banners]);
    const [heroIndex, setHeroIndex] = useState(0);
    const [activeStory, setActiveStory] = useState<ActiveStoryState | null>(null);

    useEffect(() => {
        if (heroBanners.length < 2) {
            return;
        }
        const timer = window.setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroBanners.length);
        }, 6000);
        return () => window.clearInterval(timer);
    }, [heroBanners.length]);

    useEffect(() => {
        if (!activeStory) {
            return;
        }
        const story = stories?.items?.[activeStory.storyIndex];
        const slides = story?.slides ?? [];
        if (slides.length === 0) {
            return;
        }
        const currentSlide = slides[activeStory.slideIndex];
        const duration = currentSlide?.duration && currentSlide.duration > 0 ? currentSlide.duration : 5000;
        const timer = window.setTimeout(() => {
            setActiveStory((prev) => {
                if (!prev) {
                    return null;
                }
                const nextSlide = prev.slideIndex + 1;
                if (nextSlide < slides.length) {
                    return { storyIndex: prev.storyIndex, slideIndex: nextSlide };
                }
                return null;
            });
        }, duration);
        return () => window.clearTimeout(timer);
    }, [activeStory, stories]);

    const closeStory = () => setActiveStory(null);

    const activeStoryData =
        activeStory != null ? stories?.items?.[activeStory.storyIndex] ?? undefined : undefined;
    const activeSlide =
        activeStory && activeStoryData?.slides ? activeStoryData.slides[activeStory.slideIndex] : undefined;

    const productParam = checkoutProductParam || DEFAULT_PRODUCT_PARAM;
    const variantParam = checkoutVariantParam || DEFAULT_VARIANT_PARAM;

    const storyItems = stories?.items ?? [];
    const categoryItems = categories?.items ?? [];
    const flashItems = flashSale?.items ?? [];
    const featuredItems = featured?.items ?? [];

    return (
        <div className="min-h-screen bg-base-100">
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8">
                {stories && (stories.heading || storyItems.length > 0) && (
                    <section className="space-y-4" data-sb-field-path={storiesFieldPath}>
                        {stories.heading && (
                            <h2 className="text-xl font-semibold" data-sb-field-path=".heading">
                                {stories.heading}
                            </h2>
                        )}
                        {storyItems.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-2" data-sb-field-path=".items">
                                {storyItems.map((story, idx) => (
                                    <button
                                        type="button"
                                        key={story._key || idx}
                                        className="flex shrink-0 flex-col items-center gap-2"
                                        onClick={() => setActiveStory({ storyIndex: idx, slideIndex: 0 })}
                                        data-sb-field-path={`.${idx}`}
                                    >
                                        <div className="rounded-full border border-primary/40 p-0.5">
                                            <div className="h-16 w-16 overflow-hidden rounded-full bg-base-200">
                                                {story.cover?.src ? (
                                                    <img
                                                        src={story.cover.src}
                                                        alt={story.cover.alt || story.name || ''}
                                                        className="h-full w-full object-cover"
                                                        {...(story.cover._id
                                                            ? ({ 'data-sb-object-id': story.cover._id } as React.HTMLAttributes<HTMLImageElement>)
                                                            : {})}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                                                        {story.name?.slice(0, 2) ?? ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {story.name && (
                                            <span
                                                className="max-w-[72px] truncate text-xs text-base-content/70"
                                                data-sb-field-path=".name"
                                            >
                                                {story.name}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {heroBanners.length > 0 && (
                    <section
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r text-white"
                        data-sb-field-path={heroCarouselFieldPath}
                    >
                        {heroBanners.map((banner, idx) => {
                            const checkoutHref = buildCheckoutHref(
                                checkoutBaseUrl,
                                banner.productSlug,
                                banner.variantSku,
                                productParam,
                                variantParam,
                                banner.quantity
                            );
                            const isActive = idx === heroIndex;
                            return (
                                <article
                                    key={banner._key || idx}
                                    className={`relative flex flex-col items-center justify-center gap-4 px-8 py-12 text-center transition-opacity duration-700 md:px-16 ${
                                        isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                                    }`}
                                    data-sb-field-path={`.banners.${idx}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient || 'from-primary to-secondary'}`} />
                                    <div className="relative flex flex-col items-center gap-4">
                                        {banner.badge && (
                                            <span
                                                className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs uppercase tracking-wide"
                                                data-sb-field-path=".badge"
                                            >
                                                {banner.badge}
                                            </span>
                                        )}
                                        {banner.title && (
                                            <h1 className="text-3xl font-bold md:text-5xl" data-sb-field-path=".title">
                                                {banner.title}
                                            </h1>
                                        )}
                                        {banner.subtitle && (
                                            <p className="max-w-2xl text-balance text-base md:text-lg" data-sb-field-path=".subtitle">
                                                {banner.subtitle}
                                            </p>
                                        )}
                                        {banner.ctaLabel && checkoutHref && (
                                            <a
                                                href={checkoutHref}
                                                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-base-100"
                                                data-sb-field-path=".ctaLabel"
                                            >
                                                <span>{banner.ctaLabel}</span>
                                                <ArrowRight className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                        {heroBanners.length > 1 && (
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <button
                                    type="button"
                                    className="ml-4 rounded-full bg-white/20 p-2 text-white backdrop-blur"
                                    onClick={() =>
                                        setHeroIndex((prev) =>
                                            (prev - 1 + heroBanners.length) % heroBanners.length
                                        )
                                    }
                                    aria-label="Previous banner"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                        {heroBanners.length > 1 && (
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <button
                                    type="button"
                                    className="mr-4 rounded-full bg-white/20 p-2 text-white backdrop-blur"
                                    onClick={() =>
                                        setHeroIndex((prev) => (prev + 1) % heroBanners.length)
                                    }
                                    aria-label="Next banner"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                        {heroBanners.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                {heroBanners.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`h-2 rounded-full transition-all ${
                                            idx === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                                        }`}
                                        onClick={() => setHeroIndex(idx)}
                                        aria-label={`Go to banner ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {categories && (categories.heading || categories.body || categoryItems.length > 0) && (
                    <section className="space-y-6" data-sb-field-path={categoriesFieldPath}>
                        {categories.heading && (
                            <h2 className="text-2xl font-bold" data-sb-field-path=".heading">
                                {categories.heading}
                            </h2>
                        )}
                        {categories.body && (
                            <div
                                className="prose max-w-none text-base-content/80"
                                data-sb-field-path=".body"
                                dangerouslySetInnerHTML={renderMarkdown(categories.body)}
                            />
                        )}
                        {categoryItems.length > 0 && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-sb-field-path=".items">
                                {categoryItems.map((item, idx) => (
                                    <a
                                        key={item._key || idx}
                                        href={item.url || '#'}
                                        className={`group flex flex-col gap-2 rounded-2xl border border-base-200/60 p-5 transition hover:-translate-y-1 hover:shadow-lg ${
                                            item.gradient ? `bg-gradient-to-br ${item.gradient} text-base-content` : 'bg-base-100'
                                        }`}
                                        data-sb-field-path={`.${idx}`}
                                    >
                                        <span className="text-3xl" data-sb-field-path=".icon">
                                            {item.icon}
                                        </span>
                                        {item.name && (
                                            <p className="text-lg font-semibold" data-sb-field-path=".name">
                                                {item.name}
                                            </p>
                                        )}
                                        {item.count && (
                                            <p className="text-sm text-base-content/70" data-sb-field-path=".count">
                                                {item.count}
                                            </p>
                                        )}
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {flashSale && (flashSale.heading || flashSale.subtitle || flashItems.length > 0) && (
                    <section className="space-y-6" data-sb-field-path={flashSaleFieldPath}>
                        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <div className="space-y-2">
                                {flashSale.heading && (
                                    <h2 className="text-2xl font-bold" data-sb-field-path=".heading">
                                        {flashSale.heading}
                                    </h2>
                                )}
                                {flashSale.subtitle && (
                                    <p className="text-base text-base-content/70" data-sb-field-path=".subtitle">
                                        {flashSale.subtitle}
                                    </p>
                                )}
                            </div>
                            {flashSale.endsIn && (
                                <div
                                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary"
                                    data-sb-field-path=".endsIn"
                                >
                                    <Clock className="h-4 w-4" />
                                    {flashSale.endsIn}
                                </div>
                            )}
                        </div>
                        {flashItems.length > 0 && (
                            <div className="grid gap-5 lg:grid-cols-3" data-sb-field-path=".items">
                                {flashItems.map((item, idx) => {
                                    const checkoutHref = buildCheckoutHref(
                                        checkoutBaseUrl,
                                        item.productSlug,
                                        item.variantSku,
                                        productParam,
                                        variantParam,
                                        item.quantity
                                    );
                                    return (
                                        <article
                                            key={item._key || idx}
                                            className="flex flex-col gap-4 rounded-2xl border border-base-200/70 bg-base-100 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                            data-sb-field-path={`.${idx}`}
                                        >
                                            {item.image?.src && (
                                                <div className="overflow-hidden rounded-xl" data-sb-field-path=".image">
                                                    <img
                                                        src={item.image.src}
                                                        alt={item.image.alt || item.name || ''}
                                                        className="h-48 w-full object-cover"
                                                        {...(item.image._id
                                                            ? ({ 'data-sb-object-id': item.image._id } as React.HTMLAttributes<HTMLImageElement>)
                                                            : {})}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-1 flex-col gap-3">
                                                {item.name && (
                                                    <h3 className="text-lg font-semibold" data-sb-field-path=".name">
                                                        {item.name}
                                                    </h3>
                                                )}
                                                {item.description && (
                                                    <p className="text-sm text-base-content/70" data-sb-field-path=".description">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                                                    {typeof item.rating === 'number' && (
                                                        <span className="inline-flex items-center gap-1" data-sb-field-path=".rating">
                                                            <Star className="h-4 w-4 fill-current" />
                                                            {item.rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                    {item.category && (
                                                        <span data-sb-field-path=".category">{item.category}</span>
                                                    )}
                                                </div>
                                                <div className="mt-auto flex flex-wrap items-baseline gap-2 text-base-content">
                                                    {typeof item.price === 'number' && (
                                                        <span className="text-xl font-bold" data-sb-field-path=".price">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    )}
                                                    {typeof item.originalPrice === 'number' && (
                                                        <span className="text-sm line-through" data-sb-field-path=".originalPrice">
                                                            {formatPrice(item.originalPrice)}
                                                        </span>
                                                    )}
                                                    {typeof item.discount === 'number' && (
                                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary" data-sb-field-path=".discount">
                                                            -{item.discount}%
                                                        </span>
                                                    )}
                                                </div>
                                                {item.ctaLabel && checkoutHref && (
                                                    <a
                                                        href={checkoutHref}
                                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 font-semibold text-primary-content"
                                                        data-sb-field-path=".ctaLabel"
                                                    >
                                                        <span>{item.ctaLabel}</span>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {featured && (featured.heading || featured.body || featuredItems.length > 0) && (
                    <section className="space-y-6" data-sb-field-path={featuredFieldPath}>
                        {featured.heading && (
                            <h2 className="text-2xl font-bold" data-sb-field-path=".heading">
                                {featured.heading}
                            </h2>
                        )}
                        {featured.body && (
                            <div
                                className="prose max-w-none text-base-content/80"
                                data-sb-field-path=".body"
                                dangerouslySetInnerHTML={renderMarkdown(featured.body)}
                            />
                        )}
                        {featuredItems.length > 0 && (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" data-sb-field-path=".items">
                                {featuredItems.map((item, idx) => {
                                    const checkoutHref = buildCheckoutHref(
                                        checkoutBaseUrl,
                                        item.productSlug,
                                        item.variantSku,
                                        productParam,
                                        variantParam,
                                        item.quantity
                                    );
                                    return (
                                        <article
                                            key={item._key || idx}
                                            className="flex h-full flex-col gap-4 rounded-2xl border border-base-200/70 bg-base-100 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                            data-sb-field-path={`.${idx}`}
                                        >
                                            {item.image?.src && (
                                                <div className="overflow-hidden rounded-xl" data-sb-field-path=".image">
                                                    <img
                                                        src={item.image.src}
                                                        alt={item.image.alt || item.name || ''}
                                                        className="h-48 w-full object-cover"
                                                        {...(item.image._id
                                                            ? ({ 'data-sb-object-id': item.image._id } as React.HTMLAttributes<HTMLImageElement>)
                                                            : {})}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-1 flex-col gap-3">
                                                {item.name && (
                                                    <h3 className="text-lg font-semibold" data-sb-field-path=".name">
                                                        {item.name}
                                                    </h3>
                                                )}
                                                {item.description && (
                                                    <p className="text-sm text-base-content/70" data-sb-field-path=".description">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                                                    {typeof item.rating === 'number' && (
                                                        <span className="inline-flex items-center gap-1" data-sb-field-path=".rating">
                                                            <Star className="h-4 w-4 fill-current" />
                                                            {item.rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                    {item.category && (
                                                        <span data-sb-field-path=".category">{item.category}</span>
                                                    )}
                                                </div>
                                                {typeof item.price === 'number' && (
                                                    <div className="text-lg font-semibold text-base-content" data-sb-field-path=".price">
                                                        {formatPrice(item.price)}
                                                    </div>
                                                )}
                                                {item.ctaLabel && checkoutHref && (
                                                    <a
                                                        href={checkoutHref}
                                                        className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-neutral px-4 py-2 font-semibold text-neutral-content"
                                                        data-sb-field-path=".ctaLabel"
                                                    >
                                                        <span>{item.ctaLabel}</span>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {support && (support.heading || support.body || (support.items?.length ?? 0) > 0) && (
                    <section className="space-y-6" data-sb-field-path={supportFieldPath}>
                        {support.heading && (
                            <h2 className="text-2xl font-bold" data-sb-field-path=".heading">
                                {support.heading}
                            </h2>
                        )}
                        {support.body && (
                            <div
                                className="prose max-w-none text-base-content/80"
                                data-sb-field-path=".body"
                                dangerouslySetInnerHTML={renderMarkdown(support.body)}
                            />
                        )}
                        {support.items?.length ? (
                            <div className="grid gap-5 md:grid-cols-2" data-sb-field-path=".items">
                                {support.items.map((item, idx) => {
                                    const iconKey = item.icon?.toLowerCase() ?? '';
                                    const IconComponent = supportIconMap[iconKey];
                                    return (
                                        <article
                                            key={item._key || idx}
                                            className="flex flex-col gap-3 rounded-2xl border border-base-200/70 bg-base-100 p-5 shadow-sm"
                                            data-sb-field-path={`.${idx}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    {IconComponent ? <IconComponent className="h-5 w-5" /> : <LifeBuoy className="h-5 w-5" />}
                                                </div>
                                                <div className="space-y-1">
                                                    {item.title && (
                                                        <h3 className="text-lg font-semibold" data-sb-field-path=".title">
                                                            {item.title}
                                                        </h3>
                                                    )}
                                                    {item.description && (
                                                        <p className="text-sm text-base-content/70" data-sb-field-path=".description">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {item.actionText && item.actionLink && (
                                                <a
                                                    href={item.actionLink}
                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                                                    data-sb-field-path=".actionText"
                                                >
                                                    <span>{item.actionText}</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </a>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        ) : null}
                    </section>
                )}
            </main>

            {activeStory && activeStoryData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
                    <div className="relative w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl" data-sb-field-path={storiesFieldPath}>
                        <button
                            type="button"
                            className="absolute right-4 top-4 text-sm text-base-content/70"
                            onClick={closeStory}
                        >
                            Close
                        </button>
                        <div data-sb-field-path={`.items.${activeStory.storyIndex}`} className="space-y-4">
                            {activeStoryData.name && (
                                <h3 className="text-lg font-semibold" data-sb-field-path=".name">
                                    {activeStoryData.name}
                                </h3>
                            )}
                            {activeSlide && (
                                <div data-sb-field-path={`.slides.${activeStory.slideIndex}`} className="space-y-3">
                                    {activeSlide.image?.src && (
                                        <div className="overflow-hidden rounded-xl" data-sb-field-path=".image">
                                            <img
                                                src={activeSlide.image.src}
                                                alt={activeSlide.image.alt || activeStoryData.name || ''}
                                                className="h-72 w-full object-cover"
                                                {...(activeSlide.image._id
                                                    ? ({ 'data-sb-object-id': activeSlide.image._id } as React.HTMLAttributes<HTMLImageElement>)
                                                    : {})}
                                            />
                                        </div>
                                    )}
                                    {activeSlide.text && (
                                        <p className="text-base" data-sb-field-path=".text">
                                            {activeSlide.text}
                                        </p>
                                    )}
                                </div>
                            )}
                            {activeStoryData.slides && activeStoryData.slides.length > 1 && (
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-sm text-base-content/70"
                                        onClick={() =>
                                            setActiveStory((prev) => {
                                                if (!prev) {
                                                    return null;
                                                }
                                                const prevSlide = Math.max(prev.slideIndex - 1, 0);
                                                return { storyIndex: prev.storyIndex, slideIndex: prevSlide };
                                            })
                                        }
                                        disabled={activeStory.slideIndex === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Prev
                                    </button>
                                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                                        {activeStoryData.slides.map((_, slideIdx) => (
                                            <span
                                                key={slideIdx}
                                                className={`h-1 w-8 rounded-full ${
                                                    slideIdx === activeStory.slideIndex ? 'bg-primary' : 'bg-base-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-sm text-base-content/70"
                                        onClick={() =>
                                            setActiveStory((prev) => {
                                                if (!prev) {
                                                    return null;
                                                }
                                                const story = stories?.items?.[prev.storyIndex];
                                                const slidesCount = story?.slides?.length ?? 0;
                                                const nextSlide = Math.min(prev.slideIndex + 1, Math.max(slidesCount - 1, 0));
                                                if (!slidesCount || nextSlide === prev.slideIndex) {
                                                    return null;
                                                }
                                                return { storyIndex: prev.storyIndex, slideIndex: nextSlide };
                                            })
                                        }
                                        disabled={
                                            activeStory.slideIndex >=
                                            ((stories?.items?.[activeStory.storyIndex]?.slides?.length ?? 0) - 1)
                                        }
                                    >
                                        Next <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
