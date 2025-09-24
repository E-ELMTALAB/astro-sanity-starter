import React from 'react';
import type {
    CategoriesSection,
    FeaturedProductsSection,
    FlashSaleSection,
    HeroCarouselSection,
    StoriesSection,
    SupportSection
} from 'types';
import { buildCheckoutUrl } from '../../telegram-shop/lib/checkout';

const CHECKOUT_ORIGIN = (import.meta as any).env?.PUBLIC_TELEGRAM_CHECKOUT_ORIGIN ?? 'https://telegram-shop.vercel.app';

// Constants for fallback arrays to avoid naming conflicts with CMS data
const STATIC_BANNERS: any[] = [];
const STATIC_STORIES: any[] = [];
const STATIC_CATEGORIES: any[] = [];
const STATIC_ITEMS: any[] = [];

type FeaturedInput = { _id?: string; heading?: string; body?: string; items?: FeaturedProductsSection['items'] };

interface TelegramShopHomeProps {
    stories?: StoriesSection | null;
    storiesFieldPath?: string;
    heroCarousel?: HeroCarouselSection | null;
    heroCarouselFieldPath?: string;
    categories?: CategoriesSection | null;
    categoriesFieldPath?: string;
    flashSale?: FlashSaleSection | null;
    flashSaleFieldPath?: string;
    featured?: FeaturedInput | null;
    featuredFieldPath?: string;
    support?: SupportSection | null;
    supportFieldPath?: string;
}

function buildCheckoutHref(productId?: string | null) {
    if (!productId) return undefined;
    try {
        return buildCheckoutUrl(CHECKOUT_ORIGIN, { productId }).toString();
    } catch {
        return undefined;
    }
}

function renderImage(image: { _id?: string; src?: string; alt?: string }, fieldPath: string) {
    if (!image?.src) {
        return null;
    }
    return (
        <div className="overflow-hidden rounded-xl" data-sb-field-path={fieldPath}>
            <img
                src={image.src}
                alt={image.alt || ''}
                className="w-full h-full object-cover"
                data-sb-object-id={image._id}
            />
        </div>
    );
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
    supportFieldPath
}: TelegramShopHomeProps) {
    return (
        <div className="space-y-16">
            {heroCarousel && (
                <section
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary text-primary-content"
                    data-sb-field-path={heroCarouselFieldPath}
                >
                    <div className="grid gap-8 p-8 sm:p-12" data-sb-field-path=".banners">
                        {(heroCarousel.banners ?? STATIC_BANNERS).map((banner, index) => {
                            const href = buildCheckoutHref(banner?.buttonLink);
                            return (
                                <article key={banner?._id || banner?._key || index} data-sb-field-path={`.${index}`}>
                                    {banner?.badge && (
                                        <span className="inline-flex rounded-full bg-black/20 px-3 py-1 text-xs" data-sb-field-path=".badge">
                                            {banner.badge}
                                        </span>
                                    )}
                                    {banner?.title && (
                                        <h1 className="mt-4 text-3xl font-bold sm:text-5xl" data-sb-field-path=".title">
                                            {banner.title}
                                        </h1>
                                    )}
                                    {banner?.subtitle && (
                                        <p className="mt-3 max-w-3xl text-lg" data-sb-field-path=".subtitle">
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    {href && banner?.buttonText && (
                                        <a
                                            href={href}
                                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-neutral"
                                            data-sb-field-path=".buttonLink"
                                        >
                                            <span data-sb-field-path=".buttonText">{banner.buttonText}</span>
                                        </a>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {stories && (
                <section data-sb-field-path={storiesFieldPath} className="space-y-6">
                    {stories.heading && (
                        <h2 className="text-2xl font-semibold" data-sb-field-path=".heading">
                            {stories.heading}
                        </h2>
                    )}
                    <div className="grid gap-4 md:grid-cols-4" data-sb-field-path=".items">
                        {(stories.items ?? STATIC_STORIES).map((story, index) => (
                            <article
                                key={story?._id || story?._key || index}
                                className="rounded-2xl border border-base-200 bg-base-100 p-4"
                                data-sb-field-path={`.${index}`}
                            >
                                {story?.cover && renderImage(story.cover, '.cover')}
                                {story?.name && (
                                    <h3 className="mt-3 font-medium" data-sb-field-path=".name">
                                        {story.name}
                                    </h3>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {categories && (
                <section data-sb-field-path={categoriesFieldPath} className="space-y-6">
                    {categories.heading && (
                        <h2 className="text-2xl font-semibold" data-sb-field-path=".heading">
                            {categories.heading}
                        </h2>
                    )}
                    {categories.body && (
                        <p className="text-muted-foreground" data-sb-field-path=".body">
                            {categories.body}
                        </p>
                    )}
                    <div className="grid gap-4 md:grid-cols-3" data-sb-field-path=".items">
                        {(categories.items ?? STATIC_CATEGORIES).map((category, index) => {
                            const href = buildCheckoutHref(category?.url);
                            return (
                                <article
                                    key={category?._id || category?._key || index}
                                    className="rounded-2xl border border-base-200 bg-base-100 p-4"
                                    data-sb-field-path={`.${index}`}
                                >
                                    {category?.name && (
                                        <h3 className="text-lg font-semibold" data-sb-field-path=".name">
                                            {category.name}
                                        </h3>
                                    )}
                                    {category?.count && (
                                        <p className="text-sm text-muted-foreground" data-sb-field-path=".count">
                                            {category.count}
                                        </p>
                                    )}
                                    {href && (
                                        <a
                                            href={href}
                                            className="mt-4 inline-flex items-center text-primary"
                                            data-sb-field-path=".url"
                                        >
                                            Shop now
                                        </a>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {flashSale && (
                <section data-sb-field-path={flashSaleFieldPath} className="space-y-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        {flashSale.heading && (
                            <h2 className="text-2xl font-semibold" data-sb-field-path=".heading">
                                {flashSale.heading}
                            </h2>
                        )}
                        {flashSale.subtitle && (
                            <p className="text-muted-foreground" data-sb-field-path=".subtitle">
                                {flashSale.subtitle}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-3" data-sb-field-path=".items">
                        {(flashSale.items ?? STATIC_ITEMS).map((item, index) => {
                            const href = buildCheckoutHref(item?.url);
                            return (
                                <article
                                    key={item?._id || item?._key || index}
                                    className="flex h-full flex-col justify-between rounded-2xl border border-base-200 bg-base-100 p-4"
                                    data-sb-field-path={`.${index}`}
                                >
                                    {item?.image && renderImage(item.image, '.image')}
                                    <div className="mt-4 space-y-2">
                                        {item?.name && (
                                            <h3 className="text-lg font-semibold" data-sb-field-path=".name">
                                                {item.name}
                                            </h3>
                                        )}
                                        {item?.description && (
                                            <p className="text-sm text-muted-foreground" data-sb-field-path=".description">
                                                {item.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            {typeof item?.price === 'number' && (
                                                <span className="text-lg font-bold" data-sb-field-path=".price">
                                                    ${item.price}
                                                </span>
                                            )}
                                            {typeof item?.originalPrice === 'number' && (
                                                <span className="text-muted-foreground line-through" data-sb-field-path=".originalPrice">
                                                    ${item.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {href && (
                                        <a
                                            href={href}
                                            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 font-semibold text-primary-content"
                                            data-sb-field-path=".url"
                                        >
                                            Add to cart
                                        </a>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {featured && (
                <section data-sb-field-path={featuredFieldPath} className="space-y-6">
                    {featured.heading && (
                        <h2 className="text-2xl font-semibold" data-sb-field-path=".heading">
                            {featured.heading}
                        </h2>
                    )}
                    {featured.body && (
                        <p className="text-muted-foreground" data-sb-field-path=".body">
                            {featured.body}
                        </p>
                    )}
                    <div className="grid gap-4 md:grid-cols-3" data-sb-field-path=".items">
                        {(featured.items ?? STATIC_ITEMS).map((item, index) => {
                            const href = buildCheckoutHref(item?.url);
                            return (
                                <article
                                    key={item?._id || item?._key || index}
                                    className="rounded-2xl border border-base-200 bg-base-100 p-4"
                                    data-sb-field-path={`.${index}`}
                                >
                                    {item?.image && renderImage(item.image, '.image')}
                                    {item?.name && (
                                        <h3 className="mt-3 text-lg font-semibold" data-sb-field-path=".name">
                                            {item.name}
                                        </h3>
                                    )}
                                    {item?.description && (
                                        <p className="text-sm text-muted-foreground" data-sb-field-path=".description">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                                        {item?.category && <span data-sb-field-path=".category">{item.category}</span>}
                                        {typeof item?.price === 'number' && (
                                            <span className="font-semibold text-primary" data-sb-field-path=".price">
                                                ${item.price}
                                            </span>
                                        )}
                                    </div>
                                    {href && (
                                        <a
                                            href={href}
                                            className="mt-4 inline-flex items-center text-primary"
                                            data-sb-field-path=".url"
                                        >
                                            View details
                                        </a>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {support && (
                <section data-sb-field-path={supportFieldPath} className="space-y-6">
                    {support.heading && (
                        <h2 className="text-2xl font-semibold" data-sb-field-path=".heading">
                            {support.heading}
                        </h2>
                    )}
                    {support.body && (
                        <p className="text-muted-foreground" data-sb-field-path=".body">
                            {support.body}
                        </p>
                    )}
                    <div className="grid gap-4 md:grid-cols-2" data-sb-field-path=".items">
                        {(support.items ?? STATIC_ITEMS).map((item, index) => {
                            const href = buildCheckoutHref(item?.actionLink);
                            return (
                                <article
                                    key={item?._id || item?._key || index}
                                    className="rounded-2xl border border-base-200 bg-base-100 p-4"
                                    data-sb-field-path={`.${index}`}
                                >
                                    {item?.title && (
                                        <h3 className="text-lg font-semibold" data-sb-field-path=".title">
                                            {item.title}
                                        </h3>
                                    )}
                                    {item?.description && (
                                        <p className="mt-2 text-sm text-muted-foreground" data-sb-field-path=".description">
                                            {item.description}
                                        </p>
                                    )}
                                    {href && item?.actionText && (
                                        <a
                                            href={href}
                                            className="mt-4 inline-flex items-center text-primary"
                                            data-sb-field-path=".actionLink"
                                        >
                                            <span data-sb-field-path=".actionText">{item.actionText}</span>
                                        </a>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
