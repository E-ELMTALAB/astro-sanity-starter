import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Facebook, Instagram, Mail, Phone, Star, Twitter, X, Youtube, Zap } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    description: string;
}

interface CartItem extends Product {
    quantity: number;
}

const featuredProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Headphones',
        price: 99.99,
        image: '/modern-wireless-headphones.jpg',
        category: 'Electronics',
        rating: 4.5,
        description: 'Premium wireless headphones with noise cancellation'
    },
    {
        id: '2',
        name: 'Smart Watch',
        price: 249.99,
        image: '/sleek-smartwatch.jpg',
        category: 'Electronics',
        rating: 4.8,
        description: 'Advanced fitness tracking and notifications'
    },
    {
        id: '5',
        name: 'Bluetooth Speaker',
        price: 59.99,
        image: '/portable-bluetooth-speaker.jpg',
        category: 'Electronics',
        rating: 4.4,
        description: 'Waterproof portable speaker with rich sound'
    }
];

const categories = [
    { name: 'Electronics', icon: '📱', count: '120+ items', gradient: 'from-blue-500/80 to-purple-600/80' },
    { name: 'Fashion', icon: '👕', count: '85+ items', gradient: 'from-pink-500/80 to-rose-600/80' },
    { name: 'Home', icon: '🏠', count: '95+ items', gradient: 'from-green-500/80 to-emerald-600/80' },
    { name: 'Fitness', icon: '💪', count: '60+ items', gradient: 'from-orange-500/80 to-red-600/80' }
];

const storyContent: Record<
    string,
    {
        title: string;
        slides: Array<{ image: string; text: string; duration: number }>;
    }
> = {
    '1': {
        title: 'New Arrivals',
        slides: [
            { image: '/modern-wireless-headphones.jpg', text: '🎧 Premium Wireless Headphones just arrived! Experience crystal-clear sound quality.', duration: 5000 },
            { image: '/sleek-smartwatch.jpg', text: '⌚ Smart Watches with advanced health tracking - now available!', duration: 5000 }
        ]
    },
    '2': {
        title: 'Flash Sale',
        slides: [
            { image: '/gaming-mouse.png', text: '🔥 50% OFF Gaming Mouse! Limited time offer - grab yours now!', duration: 5000 },
            { image: '/wireless-earbuds.png', text: "💥 Flash Sale: Wireless Earbuds at 40% OFF! Don't miss out!", duration: 5000 }
        ]
    },
    '3': {
        title: 'Electronics',
        slides: [{ image: '/portable-bluetooth-speaker.jpg', text: '🔊 Latest Electronics Collection - Speakers, Headphones & More!', duration: 5000 }]
    },
    '4': { title: 'Fashion', slides: [{ image: '/diverse-fashion-collection.png', text: '👗 New Fashion Collection - Trendy styles for every occasion!', duration: 5000 }] },
    '5': { title: 'Home Decor', slides: [{ image: '/cozy-cabin-interior.png', text: '🏠 Transform your space with our Home Decor collection!', duration: 5000 }] }
};

const stories = [
    { id: '1', name: 'New Arrivals', image: '/modern-wireless-headphones.jpg', isViewed: false },
    { id: '2', name: 'Flash Sale', image: '/sleek-smartwatch.jpg', isViewed: true },
    { id: '3', name: 'Electronics', image: '/portable-bluetooth-speaker.jpg', isViewed: false },
    { id: '4', name: 'Fashion', image: '/diverse-fashion-collection.png', isViewed: false },
    { id: '5', name: 'Home Decor', image: '/cozy-cabin-interior.png', isViewed: true }
];

const discountedProducts: (Product & { originalPrice: number; discount: number })[] = [
    {
        id: 'd1',
        name: 'Gaming Mouse',
        price: 39.99,
        originalPrice: 79.99,
        discount: 50,
        image: '/gaming-mouse.png',
        category: 'Electronics',
        rating: 4.6,
        description: 'High-precision gaming mouse with RGB lighting'
    },
    {
        id: 'd2',
        name: 'Wireless Earbuds',
        price: 59.99,
        originalPrice: 99.99,
        discount: 40,
        image: '/wireless-earbuds.png',
        category: 'Electronics',
        rating: 4.3,
        description: 'True wireless earbuds with active noise cancellation'
    },
    {
        id: 'd3',
        name: 'Fitness Tracker',
        price: 79.99,
        originalPrice: 129.99,
        discount: 38,
        image: '/fitness-tracker-lifestyle.png',
        category: 'Fitness',
        rating: 4.5,
        description: 'Advanced fitness tracking with heart rate monitor'
    }
];

const banners = [
    { id: 1, title: 'Up to 50% Off Everything', subtitle: "Don't miss out on our biggest sale of the year", buttonText: 'Shop Sale', buttonLink: '/products', badge: 'Limited Time Offer', gradient: 'from-primary to-primary/80' },
    { id: 2, title: 'New Arrivals Just Dropped', subtitle: 'Discover the latest trends and must-have items', buttonText: 'Explore New', buttonLink: '/products?filter=new', badge: 'Fresh Collection', gradient: 'from-purple-500 to-pink-500' },
    { id: 3, title: 'Free Shipping Weekend', subtitle: 'No minimum order required - shop now and save', buttonText: 'Shop Now', buttonLink: '/products', badge: 'This Weekend Only', gradient: 'from-green-500 to-emerald-500' },
    { id: 4, title: 'Electronics Mega Sale', subtitle: 'Latest tech at unbeatable prices', buttonText: 'Shop Electronics', buttonLink: '/products?category=Electronics', badge: 'Tech Deals', gradient: 'from-blue-500 to-cyan-500' }
];

export default function TelegramShopHome() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [activeStory, setActiveStory] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideProgress, setSlideProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length), 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!activeStory) return;
        const story = storyContent[activeStory];
        if (!story) return;
        const currentSlideData = story.slides[currentSlide];
        const duration = currentSlideData.duration;
        const interval = setInterval(() => {
            setSlideProgress((prev) => {
                const next = prev + 100 / (duration / 100);
                if (next >= 100) {
                    if (currentSlide < story.slides.length - 1) {
                        setCurrentSlide((p) => p + 1);
                        return 0;
                    }
                    setActiveStory(null);
                    setCurrentSlide(0);
                    return 0;
                }
                return next;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [activeStory, currentSlide]);

    const addToCart = (product: Product) => {
        setCartItems((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity === 0) setCartItems((prev) => prev.filter((i) => i.id !== id));
        else setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    };

    const openStory = (storyId: string) => {
        setActiveStory(storyId);
        setCurrentSlide(0);
        setSlideProgress(0);
    };

    const closeStory = () => {
        setActiveStory(null);
        setCurrentSlide(0);
        setSlideProgress(0);
    };

    const nextSlide = () => {
        const story = storyContent[activeStory as string];
        if (story && currentSlide < story.slides.length - 1) {
            setCurrentSlide((p) => p + 1);
            setSlideProgress(0);
        } else closeStory();
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide((p) => p - 1);
            setSlideProgress(0);
        }
    };

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartItemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const currentBanner = banners[currentBannerIndex];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Top bar placeholder replacing ShopHeader/ShoppingCart for now */}
            <header className="px-4 py-3 border-b border-base-200">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <div className="font-extrabold">TeleShop</div>
                    <div className="text-sm opacity-80">Cart: {cartItemCount} (${cartTotal.toFixed(2)})</div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 space-y-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Stories</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {stories.map((story) => (
                            <button key={story.id} className="flex-shrink-0 text-center space-y-2" onClick={() => openStory(story.id)}>
                                <div className={`w-16 h-16 rounded-full p-0.5 ${story.isViewed ? 'bg-base-200' : 'bg-gradient-to-tr from-primary to-primary/60'}`}>
                                    <div className="w-full h-full rounded-full bg-base-100 p-0.5">
                                        <img src={story.image || '/placeholder.svg'} onError={(e) => (e.currentTarget.src = '/placeholder.svg')} alt={story.name} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                </div>
                                <p className="text-xs opacity-70 max-w-[64px] truncate">{story.name}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <section className={`relative rounded-xl overflow-hidden bg-gradient-to-r ${currentBanner.gradient} text-white`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative p-8 md:p-12 text-center space-y-4">
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-black/40 border border-white/30 backdrop-blur-sm">
                            <Zap className="w-3 h-3" />
                            {currentBanner.badge}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-balance">{currentBanner.title}</h1>
                        <p className="text-lg opacity-90 max-w-xl mx-auto">{currentBanner.subtitle}</p>
                        <a href={currentBanner.buttonLink} className="inline-flex items-center gap-2 bg-white text-black rounded-md px-6 py-3 font-semibold">
                            {currentBanner.buttonText}
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, i) => (
                            <button key={i} onClick={() => setCurrentBannerIndex(i)} className={`w-2 h-2 rounded-full ${i === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'}`} />
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Featured Products</h2>
                        <p className="opacity-70">Hand-picked favorites just for you</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="bg-base-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-base-200 relative overflow-hidden">
                                    <img src={product.image || '/placeholder.svg'} onError={(e) => (e.currentTarget.src = '/placeholder.svg')} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">{product.name}</h3>
                                        <p className="text-sm opacity-70 line-clamp-2">{product.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{product.rating}</span>
                                        </div>
                                        <span className="text-xs opacity-70">{product.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                                        <button onClick={() => addToCart(product)} className="px-3 py-2 rounded-md bg-primary text-primary-content text-sm font-semibold">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Social links */}
                <section className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Follow Us</h2>
                        <p className="opacity-70">Stay connected for the latest updates and exclusive offers</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[{ Icon: Instagram, label: 'Instagram', handle: '@teleshop' }, { Icon: Facebook, label: 'Facebook', handle: 'TeleShop' }, { Icon: Twitter, label: 'Twitter', handle: '@teleshop' }, { Icon: Youtube, label: 'YouTube', handle: 'TeleShop' }].map(({ Icon, label, handle }) => (
                            <a key={label} className="flex flex-col items-center space-y-3 p-4 rounded-xl border hover:bg-base-200/40 transition-colors">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-base-200">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold">{label}</p>
                                    <p className="text-sm opacity-70">{handle}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            </main>

            {activeStory && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-md mx-auto">
                        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                            {storyContent[activeStory]?.slides.map((_, index) => (
                                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: index < currentSlide ? '100%' : index === currentSlide ? `${slideProgress}%` : '0%' }} />
                                </div>
                            ))}
                        </div>
                        <button onClick={closeStory} className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70">
                            <X className="w-4 h-4" />
                        </button>
                        {storyContent[activeStory] && (
                            <div className="relative w-full h-full">
                                <img src={storyContent[activeStory].slides[currentSlide].image || '/placeholder.svg'} onError={(e) => (e.currentTarget.src = '/placeholder.svg')} alt="Story" className="w-full h-full object-cover" />
                                <div className="absolute bottom-20 left-4 right-4 z-10">
                                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
                                        <p className="text-white text-lg font-medium">{storyContent[activeStory].slides[currentSlide].text}</p>
                                    </div>
                                </div>
                                <button onClick={prevSlide} className="absolute left-0 top-0 w-1/3 h-full z-10 flex items-center justify-start pl-4 opacity-0 hover:opacity-100">
                                    <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
                                </button>
                                <button onClick={nextSlide} className="absolute right-0 top-0 w-1/3 h-full z-10 flex items-center justify-end pr-4 opacity-0 hover:opacity-100">
                                    <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
                                </button>
                                <div className="absolute left-0 top-0 w-1/2 h-full z-10 md:hidden" onClick={prevSlide} />
                                <div className="absolute right-0 top-0 w-1/2 h-full z-10 md:hidden" onClick={nextSlide} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


