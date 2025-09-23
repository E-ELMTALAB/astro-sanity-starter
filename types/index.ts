export interface Action {
    _type?: string;
    label: string;
    url?: string;
    ariaLabel?: string;
}

export interface ActionButton extends Action {
    theme?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface ActionLink extends Action {}

export interface BackgroundImage {
    image?: CustomImage;
    opacity?: number;
}

export interface Badge {
    label: string;
    theme?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface Card {
    badge?: Badge;
    heading?: string;
    body?: string;
    cta?: Array<ActionButton | ActionLink>;
    image?: CustomImage;
    theme?: 'light' | 'dark' | 'transparent';
    textAlign?: 'left' | 'center';
    hasBorder?: boolean;
}

export interface CardsSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<Card>;
    columns?: 'one' | 'two' | 'three';
}

export interface FeaturedProductsSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<ProductCardItem>;
}

export interface HeroCarouselSection extends Section {
    banners?: Array<{
        title?: string;
        subtitle?: string;
        buttonText?: string;
        buttonLink?: string;
        badge?: string;
        gradient?: string;
        productSlug?: string;
        variantSku?: string;
    }>;
}

export interface CategoriesSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<{
        name?: string;
        icon?: string;
        count?: string;
        gradient?: string;
        url?: string;
    }>;
}

export interface FlashSaleSection extends Section {
    heading?: string;
    subtitle?: string;
    endsIn?: string;
    items?: Array<{
        image?: CustomImage;
        name?: string;
        description?: string;
        price?: number;
        originalPrice?: number;
        discount?: number;
        category?: string;
        rating?: number;
        url?: string;
        productSlug?: string;
        variantSku?: string;
    }>;
}

export interface StoriesSection extends Section {
    heading?: string;
    items?: Array<{
        name?: string;
        cover?: CustomImage;
        slides?: Array<{
            image?: CustomImage;
            text?: string;
            duration?: number;
        }>;
    }>;
}

export interface SupportSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<{
        icon?: string;
        title?: string;
        description?: string;
        actionText?: string;
        actionLink?: string;
    }>;
}

export interface Company {
    _id: string;
    name: string;
    logo?: CustomImage;
}

export interface CustomImage {
    _id?: string;
    src: string;
    alt?: string;
    dimensions?: { height: number; width: number };
}

export interface ProductCardItem {
    image?: CustomImage;
    name: string;
    description?: string;
    rating?: number;
    category?: string;
    price?: number;
    url?: string;
    productSlug?: string;
    variantSku?: string;
}

export interface CtaSection extends Section {
    heading?: string;
    body?: string;
    cta?: Array<ActionButton | ActionLink>;
}

export interface Footer {
    text?: string;
}

export interface Header {
    title?: string;
    logo?: CustomImage;
    navLinks?: Array<ActionButton | ActionLink>;
}

export interface HeroSection extends Section {
    heading?: string;
    body?: string;
    cta?: Array<ActionButton | ActionLink>;
}

export interface LogosSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<CustomImage>;
    motion?: 'static' | 'moveToLeft' | 'moveToRight';
}

export interface Page {
    _id: string;
    slug: Slug;
    title: string;
    sections: Array<
        | CardsSection
        | CtaSection
        | HeroSection
        | LogosSection
        | TestimonialsSection
        | FeaturedProductsSection
        | HeroCarouselSection
        | CategoriesSection
        | FlashSaleSection
        | StoriesSection
        | SupportSection
    >;
    metaTitle?: string;
    addTitleSuffix?: boolean;
    metaDescription?: string;
    socialImage?: CustomImage;
}

export interface Person {
    _id: string;
    name: string;
    title?: string;
    image?: CustomImage;
    company?: Company;
}

export interface Section {
    _type?: string;
    theme?: 'light' | 'dark';
    backgroundImage?: BackgroundImage;
    width?: 'full' | 'inset';
}

export interface SiteConfig {
    _id?: string;
    favicon?: CustomImage;
    header?: Header;
    footer?: Footer;
    titleSuffix?: string;
}

export interface Slug {
    current: string;
}

export interface Testimonial {
    quote?: string;
    author?: Person;
    theme?: 'light' | 'dark' | 'transparent';
    hasBorder?: boolean;
}

export interface TestimonialsSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<Testimonial>;
    columns?: 'one' | 'two';
}
