export interface CustomImage {
    _id?: string;
    src?: string;
    alt?: string;
    dimensions?: {
        height?: number;
        width?: number;
    };
}

export interface CheckoutTarget {
    productSlug?: string;
    variantSku?: string;
    quantity?: number;
}

export interface HeroBanner extends CheckoutTarget {
    _key?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    badge?: string;
    gradient?: string;
}

export interface HeroCarouselSection extends SectionBase {
    _type?: 'heroCarouselSection';
    banners?: HeroBanner[];
}

export interface StorySlide {
    _key?: string;
    image?: CustomImage;
    text?: string;
    duration?: number;
}

export interface StoryItem {
    _key?: string;
    name?: string;
    cover?: CustomImage;
    slides?: StorySlide[];
}

export interface StoriesSection extends SectionBase {
    _type?: 'storiesSection';
    heading?: string;
    items?: StoryItem[];
}

export interface CategoryItem {
    _key?: string;
    name?: string;
    icon?: string;
    count?: string;
    gradient?: string;
    url?: string;
}

export interface CategoriesSection extends SectionBase {
    _type?: 'categoriesSection';
    heading?: string;
    body?: string;
    items?: CategoryItem[];
}

export interface FlashSaleItem extends CheckoutTarget {
    _key?: string;
    image?: CustomImage;
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    discount?: number;
    category?: string;
    rating?: number;
    ctaLabel?: string;
}

export interface FlashSaleSection extends SectionBase {
    _type?: 'flashSaleSection';
    heading?: string;
    subtitle?: string;
    endsIn?: string;
    items?: FlashSaleItem[];
}

export interface ProductCardItem extends CheckoutTarget {
    _key?: string;
    image?: CustomImage;
    name?: string;
    description?: string;
    rating?: number;
    category?: string;
    price?: number;
    ctaLabel?: string;
}

export interface FeaturedProductsSection extends SectionBase {
    _type?: 'featuredProductsSection';
    heading?: string;
    body?: string;
    items?: ProductCardItem[];
}

export interface SupportItem {
    _key?: string;
    icon?: string;
    title?: string;
    description?: string;
    actionText?: string;
    actionLink?: string;
}

export interface SupportSection extends SectionBase {
    _type?: 'supportSection';
    heading?: string;
    body?: string;
    items?: SupportItem[];
}

export interface SectionBase {
    theme?: 'light' | 'dark';
    width?: 'full' | 'inset';
}

export type PageSection =
    | StoriesSection
    | HeroCarouselSection
    | CategoriesSection
    | FlashSaleSection
    | FeaturedProductsSection
    | SupportSection;

export interface Slug {
    current: string;
}

export interface Page {
    _id: string;
    slug: Slug;
    title?: string;
    sections?: PageSection[];
    metaTitle?: string;
    addTitleSuffix?: boolean;
    metaDescription?: string;
    socialImage?: CustomImage;
}

export interface NavigationItem {
    _key?: string;
    label?: string;
    href?: string;
}

export interface Header {
    title?: string;
    logo?: CustomImage;
    navItems?: NavigationItem[];
}

export interface Footer {
    text?: string;
}

export interface SiteConfig {
    _id?: string;
    favicon?: CustomImage;
    header?: Header;
    footer?: Footer;
    titleSuffix?: string;
    checkoutBaseUrl?: string;
    checkoutProductParam?: string;
    checkoutVariantParam?: string;
}
