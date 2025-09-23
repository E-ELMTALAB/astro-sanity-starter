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

export interface CustomImage {
    _id?: string;
    src: string;
    alt?: string;
    dimensions?: { height: number; width: number };
}

export interface BackgroundImage {
    image?: CustomImage;
    opacity?: number;
}

export interface Section {
    _type?: string;
    _key?: string;
    theme?: 'light' | 'dark';
    backgroundImage?: BackgroundImage;
    width?: 'full' | 'inset';
}

export interface StoriesSection extends Section {
    heading?: string;
    items?: Array<{
        _id?: string;
        _key?: string;
        name?: string;
        cover?: CustomImage;
        slides?: Array<{
            _id?: string;
            _key?: string;
            image?: CustomImage;
            text?: string;
            duration?: number;
        }>;
    }>;
}

export interface HeroCarouselSection extends Section {
    banners?: Array<{
        _id?: string;
        _key?: string;
        title?: string;
        subtitle?: string;
        buttonText?: string;
        buttonLink?: string;
        badge?: string;
        gradient?: string;
    }>;
}

export interface CategoriesSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<{
        _id?: string;
        _key?: string;
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
        _id?: string;
        _key?: string;
        image?: CustomImage;
        name?: string;
        description?: string;
        price?: number;
        originalPrice?: number;
        discount?: number;
        category?: string;
        rating?: number;
        url?: string;
    }>;
}

export interface ProductCardItem {
    _id?: string;
    _key?: string;
    image?: CustomImage;
    name: string;
    description?: string;
    rating?: number;
    category?: string;
    price?: number;
    url?: string;
}

export interface FeaturedProductsSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<ProductCardItem>;
}

export interface SupportSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<{
        _id?: string;
        _key?: string;
        icon?: string;
        title?: string;
        description?: string;
        actionText?: string;
        actionLink?: string;
    }>;
}

export interface Footer {
    text?: string;
}

export interface Header {
    title?: string;
    logo?: CustomImage;
    navLinks?: Array<ActionButton | ActionLink>;
}

export interface Page {
    _id: string;
    slug: Slug;
    title: string;
    sections: Array<
        | StoriesSection
        | HeroCarouselSection
        | CategoriesSection
        | FlashSaleSection
        | FeaturedProductsSection
        | SupportSection
    >;
    metaTitle?: string;
    addTitleSuffix?: boolean;
    metaDescription?: string;
    socialImage?: CustomImage;
}

export interface SiteConfig {
    _id?: string;
    titleSuffix?: string;
    header?: Header;
    footer?: Footer;
}

export interface Slug {
    current: string;
}
