import { type ModelExtension } from '@stackbit/types';
import { actionButton } from './actionButton';
import { backgroundImage } from './backgroundImage';
import { categoriesSection } from './categoriesSection';
import { featuredProductsSection } from './featuredProductsSection';
import { flashSaleSection } from './flashSaleSection';
import { heroCarouselSection } from './heroCarouselSection';
import { page } from './page';
import { productCard } from './productCard';
import { siteConfig } from './siteConfig';
import { storiesSection } from './storiesSection';
import { supportSection } from './supportSection';

export const allModelExtensions: ModelExtension[] = [
    actionButton,
    backgroundImage,
    categoriesSection,
    featuredProductsSection,
    flashSaleSection,
    heroCarouselSection,
    page,
    productCard,
    siteConfig,
    storiesSection,
    supportSection
];
