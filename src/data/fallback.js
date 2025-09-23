export const fallbackPages = [
    {
        _id: 'fallback-home',
        slug: { _type: 'slug', current: '/' },
        title: 'Telegram Shop',
        metaTitle: 'Telegram Shop',
        metaDescription: 'Sample store experience for Telegram shoppers.',
        socialImage: { src: '/placeholder.svg' },
        sections: [
            {
                _type: 'heroCarouselSection',
                _key: 'hero',
                banners: [
                    {
                        _id: 'banner-1',
                        title: 'Shop Smarter with Telegram',
                        subtitle: 'Discover curated products and frictionless checkout.',
                        buttonText: 'Start shopping',
                        buttonLink: 'starter-kit'
                    }
                ]
            },
            {
                _type: 'storiesSection',
                _key: 'stories',
                heading: 'Stories',
                items: [
                    {
                        _id: 'story-1',
                        name: 'Flash Deals',
                        cover: {
                            _id: 'image-story-1',
                            src: '/placeholder.svg',
                            alt: 'Flash deals'
                        }
                    },
                    {
                        _id: 'story-2',
                        name: 'New Arrivals',
                        cover: {
                            _id: 'image-story-2',
                            src: '/placeholder.svg',
                            alt: 'New arrivals'
                        }
                    }
                ]
            },
            {
                _type: 'categoriesSection',
                _key: 'categories',
                heading: 'Shop by Category',
                body: 'Browse curated collections tailored for Telegram.',
                items: [
                    { _id: 'category-1', name: 'Accessories', count: '24 products', url: 'accessories' },
                    { _id: 'category-2', name: 'Home', count: '18 products', url: 'home' },
                    { _id: 'category-3', name: 'Fitness', count: '12 products', url: 'fitness' }
                ]
            },
            {
                _type: 'flashSaleSection',
                _key: 'flash',
                heading: 'Flash Sale',
                subtitle: 'Limited offers for Telegram shoppers.',
                items: [
                    {
                        _id: 'flash-1',
                        name: 'Wireless Earbuds',
                        description: 'Noise cancelling earbuds with charging case.',
                        price: 59,
                        originalPrice: 99,
                        url: 'wireless-earbuds',
                        image: { _id: 'flash-image-1', src: '/placeholder.svg', alt: 'Wireless earbuds' }
                    },
                    {
                        _id: 'flash-2',
                        name: 'Smart Lamp',
                        description: 'Mood lighting controlled directly from Telegram.',
                        price: 39,
                        originalPrice: 59,
                        url: 'smart-lamp',
                        image: { _id: 'flash-image-2', src: '/placeholder.svg', alt: 'Smart lamp' }
                    }
                ]
            },
            {
                _type: 'featuredProductsSection',
                _key: 'featured',
                heading: 'Featured Products',
                body: 'Hand-picked items that work great with Telegram commerce.',
                items: [
                    {
                        _id: 'featured-1',
                        name: 'Creator Starter Kit',
                        description: 'Essential gear for launching a Telegram shop.',
                        category: 'Accessories',
                        price: 129,
                        url: 'creator-starter-kit',
                        image: { _id: 'featured-image-1', src: '/placeholder.svg', alt: 'Creator kit' }
                    },
                    {
                        _id: 'featured-2',
                        name: 'Community Hoodie',
                        description: 'Cozy hoodie with Telegram community flair.',
                        category: 'Apparel',
                        price: 79,
                        url: 'community-hoodie',
                        image: { _id: 'featured-image-2', src: '/placeholder.svg', alt: 'Hoodie' }
                    }
                ]
            },
            {
                _type: 'supportSection',
                _key: 'support',
                heading: 'Support & Onboarding',
                body: 'Everything you need to launch your Telegram store.',
                items: [
                    {
                        _id: 'support-1',
                        title: 'Join onboarding webinar',
                        description: 'Weekly walkthrough for new merchants.',
                        actionText: 'Reserve a seat',
                        actionLink: 'webinar'
                    },
                    {
                        _id: 'support-2',
                        title: 'Schedule 1:1 help',
                        description: 'Chat with our team about your Telegram strategy.',
                        actionText: 'Book a call',
                        actionLink: 'support-call'
                    }
                ]
            }
        ]
    }
];

export const fallbackSiteConfig = {
    _id: 'site-config-fallback',
    titleSuffix: 'Telegram Shop',
    header: {
        title: 'Telegram Shop',
        navLinks: [
            { _type: 'actionLink', label: 'Shop', url: '/' },
            { _type: 'actionLink', label: 'Stories', url: '#stories' }
        ]
    },
    footer: {
        text: '© Telegram Shop — Built for instant commerce.'
    }
};
