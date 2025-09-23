import { type ModelExtension } from '@stackbit/types';
import { featuredProductsSection } from './featuredProductsSection';
import { heroCarouselSection } from './heroCarouselSection';
import { categoriesSection } from './categoriesSection';
import { flashSaleSection } from './flashSaleSection';
import { storiesSection } from './storiesSection';
import { supportSection } from './supportSection';
import { page } from './page';
import { siteConfig } from './siteConfig';
import { productCard } from './productCard';
import { navItem } from './navItem';

export const allModelExtensions: ModelExtension[] = [
    featuredProductsSection,
    heroCarouselSection,
    categoriesSection,
    flashSaleSection,
    storiesSection,
    supportSection,
    page,
    siteConfig,
    productCard,
    navItem
];
