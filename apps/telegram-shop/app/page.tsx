"use client"

import { useState, useEffect } from "react"
import { ShopHeader } from "@/components/shop-header"
import { ShoppingCart } from "@/components/shopping-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ArrowRight,
  Zap,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating: number
  description: string
}

export interface CartItem extends Product {
  quantity: number
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    image: "/modern-wireless-headphones.jpg",
    category: "Electronics",
    rating: 4.5,
    description: "Premium wireless headphones with noise cancellation",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 249.99,
    image: "/sleek-smartwatch.jpg",
    category: "Electronics",
    rating: 4.8,
    description: "Advanced fitness tracking and notifications",
  },
  {
    id: "5",
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "/portable-bluetooth-speaker.jpg",
    category: "Electronics",
    rating: 4.4,
    description: "Waterproof portable speaker with rich sound",
  },
]

const categories = [
  {
    name: "Electronics",
    icon: "📱",
    count: "120+ items",
    gradient: "from-blue-500/80 to-purple-600/80",
  },
  {
    name: "Fashion",
    icon: "👕",
    count: "85+ items",
    gradient: "from-pink-500/80 to-rose-600/80",
  },
  {
    name: "Home",
    icon: "🏠",
    count: "95+ items",
    gradient: "from-green-500/80 to-emerald-600/80",
  },
  {
    name: "Fitness",
    icon: "💪",
    count: "60+ items",
    gradient: "from-orange-500/80 to-red-600/80",
  },
]

const storyContent = {
  "1": {
    title: "New Arrivals",
    slides: [
      {
        image: "/modern-wireless-headphones.jpg",
        text: "🎧 Premium Wireless Headphones just arrived! Experience crystal-clear sound quality.",
        duration: 5000,
      },
      {
        image: "/sleek-smartwatch.jpg",
        text: "⌚ Smart Watches with advanced health tracking - now available!",
        duration: 5000,
      },
    ],
  },
  "2": {
    title: "Flash Sale",
    slides: [
      {
        image: "/gaming-mouse.png",
        text: "🔥 50% OFF Gaming Mouse! Limited time offer - grab yours now!",
        duration: 5000,
      },
      {
        image: "/wireless-earbuds.png",
        text: "💥 Flash Sale: Wireless Earbuds at 40% OFF! Don't miss out!",
        duration: 5000,
      },
    ],
  },
  "3": {
    title: "Electronics",
    slides: [
      {
        image: "/portable-bluetooth-speaker.jpg",
        text: "🔊 Latest Electronics Collection - Speakers, Headphones & More!",
        duration: 5000,
      },
    ],
  },
  "4": {
    title: "Fashion",
    slides: [
      {
        image: "/diverse-fashion-collection.png",
        text: "👗 New Fashion Collection - Trendy styles for every occasion!",
        duration: 5000,
      },
    ],
  },
  "5": {
    title: "Home Decor",
    slides: [
      {
        image: "/cozy-cabin-interior.png",
        text: "🏠 Transform your space with our Home Decor collection!",
        duration: 5000,
      },
    ],
  },
}

const stories = [
  { id: "1", name: "New Arrivals", image: "/modern-wireless-headphones.jpg", isViewed: false },
  { id: "2", name: "Flash Sale", image: "/sleek-smartwatch.jpg", isViewed: true },
  { id: "3", name: "Electronics", image: "/portable-bluetooth-speaker.jpg", isViewed: false },
  { id: "4", name: "Fashion", image: "/diverse-fashion-collection.png", isViewed: false },
  { id: "5", name: "Home Decor", image: "/cozy-cabin-interior.png", isViewed: true },
]

const discountedProducts: (Product & { originalPrice: number; discount: number })[] = [
  {
    id: "d1",
    name: "Gaming Mouse",
    price: 39.99,
    originalPrice: 79.99,
    discount: 50,
    image: "/gaming-mouse.png",
    category: "Electronics",
    rating: 4.6,
    description: "High-precision gaming mouse with RGB lighting",
  },
  {
    id: "d2",
    name: "Wireless Earbuds",
    price: 59.99,
    originalPrice: 99.99,
    discount: 40,
    image: "/wireless-earbuds.png",
    category: "Electronics",
    rating: 4.3,
    description: "True wireless earbuds with active noise cancellation",
  },
  {
    id: "d3",
    name: "Fitness Tracker",
    price: 79.99,
    originalPrice: 129.99,
    discount: 38,
    image: "/fitness-tracker-lifestyle.png",
    category: "Fitness",
    rating: 4.5,
    description: "Advanced fitness tracking with heart rate monitor",
  },
]

const banners = [
  {
    id: 1,
    title: "Up to 50% Off Everything",
    subtitle: "Don't miss out on our biggest sale of the year",
    buttonText: "Shop Sale",
    buttonLink: "/products",
    badge: "Limited Time Offer",
    gradient: "from-primary to-primary/80",
  },
  {
    id: 2,
    title: "New Arrivals Just Dropped",
    subtitle: "Discover the latest trends and must-have items",
    buttonText: "Explore New",
    buttonLink: "/products?filter=new",
    badge: "Fresh Collection",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Free Shipping Weekend",
    subtitle: "No minimum order required - shop now and save",
    buttonText: "Shop Now",
    buttonLink: "/products",
    badge: "This Weekend Only",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "Electronics Mega Sale",
    subtitle: "Latest tech at unbeatable prices",
    buttonText: "Shop Electronics",
    buttonLink: "/products?category=Electronics",
    badge: "Tech Deals",
    gradient: "from-blue-500 to-cyan-500",
  },
]

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [activeStory, setActiveStory] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!activeStory) return

    const story = storyContent[activeStory as keyof typeof storyContent]
    if (!story) return

    const currentSlideData = story.slides[currentSlide]
    const duration = currentSlideData.duration

    const interval = setInterval(() => {
      setSlideProgress((prev) => {
        const newProgress = prev + 100 / (duration / 100)
        if (newProgress >= 100) {
          // Move to next slide or close story
          if (currentSlide < story.slides.length - 1) {
            setCurrentSlide((prev) => prev + 1)
            return 0
          } else {
            // Story finished, close it
            setActiveStory(null)
            setCurrentSlide(0)
            return 0
          }
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [activeStory, currentSlide])

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const openStory = (storyId: string) => {
    setActiveStory(storyId)
    setCurrentSlide(0)
    setSlideProgress(0)
  }

  const closeStory = () => {
    setActiveStory(null)
    setCurrentSlide(0)
    setSlideProgress(0)
  }

  const nextSlide = () => {
    const story = storyContent[activeStory as keyof typeof storyContent]
    if (story && currentSlide < story.slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
      setSlideProgress(0)
    } else {
      closeStory()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
      setSlideProgress(0)
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const currentBanner = banners[currentBannerIndex]

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Stories section moved to top of page */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Stories</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0 text-center space-y-2 cursor-pointer"
                onClick={() => openStory(story.id)}
              >
                <div
                  className={`w-16 h-16 rounded-full p-0.5 ${story.isViewed ? "bg-gray-300" : "bg-gradient-to-tr from-primary to-primary/60"}`}
                >
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground max-w-[64px] truncate">{story.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`relative rounded-xl overflow-hidden bg-gradient-to-r ${currentBanner.gradient} text-primary-foreground transition-all duration-500`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-8 md:p-12 text-center space-y-4">
            <Badge variant="secondary" className="bg-black/40 text-white border-white/50 backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              {currentBanner.badge}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-balance">{currentBanner.title}</h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">{currentBanner.subtitle}</p>
            <Link href={currentBanner.buttonLink}>
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {currentBanner.buttonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Must-Have Products</h2>
            <p className="text-muted-foreground">Our top picks that everyone's talking about</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Premium Headphones Banner */}
            <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src="/modern-wireless-headphones.jpg"
                alt="Premium Wireless Headphones"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Badge className="bg-primary text-primary-foreground">🎧 Best Seller</Badge>
                  <div className="text-right">
                    <div className="text-white text-2xl font-bold">$99.99</div>
                    <div className="text-white/80 text-sm line-through">$149.99</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-white text-xl font-bold">Premium Wireless Headphones</h3>
                    <p className="text-white/90 text-sm">Crystal clear sound with active noise cancellation</p>
                  </div>
                  <Link href="/product/1">
                    <Button className="bg-white text-black hover:bg-white/90">
                      Shop Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Smart Watch Banner */}
            <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src="/sleek-smartwatch.jpg"
                alt="Smart Watch"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Badge className="bg-green-500 text-white">⌚ New Arrival</Badge>
                  <div className="text-right">
                    <div className="text-white text-2xl font-bold">$249.99</div>
                    <div className="text-white/80 text-sm">Free Shipping</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-white text-xl font-bold">Advanced Smart Watch</h3>
                    <p className="text-white/90 text-sm">Track your fitness and stay connected</p>
                  </div>
                  <Link href="/product/2">
                    <Button className="bg-white text-black hover:bg-white/90">
                      Discover More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/30 dark:from-primary/10 dark:via-blue-950/20 dark:to-purple-950/10 rounded-2xl p-8 border border-primary/20">
            <div className="text-center space-y-4 mb-8">
              <Badge className="bg-primary/10 text-primary border-primary/20">🔥 Trending Now</Badge>
              <h3 className="text-2xl md:text-3xl font-bold">What's Popular Today</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the products everyone's talking about - handpicked based on customer favorites and trending
                searches
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    #1
                  </div>
                  <div>
                    <h4 className="font-semibold">Most Loved</h4>
                    <p className="text-sm text-muted-foreground">Highest rated this week</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/modern-wireless-headphones.jpg"
                    alt="Trending Product"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Wireless Headphones</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2.1k reviews</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    #2
                  </div>
                  <div>
                    <h4 className="font-semibold">Best Seller</h4>
                    <p className="text-sm text-muted-foreground">Flying off the shelves</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/sleek-smartwatch.jpg" alt="Best Seller" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">Smart Watch</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        1.2k sold
                      </Badge>
                      <span className="text-sm text-muted-foreground">this month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    #3
                  </div>
                  <div>
                    <h4 className="font-semibold">Rising Star</h4>
                    <p className="text-sm text-muted-foreground">Gaining popularity fast</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/portable-bluetooth-speaker.jpg"
                    alt="Rising Star"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Bluetooth Speaker</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      >
                        +150%
                      </Badge>
                      <span className="text-sm text-muted-foreground">growth</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/trending">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  View All Trending Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          

          {/* Redesigned Gaming Collection Banner */}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground">Find exactly what you're looking for</p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} href={`/products?category=${category.name}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative p-6 h-32 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{category.count}</p>
                      </div>
                      <div className="text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        {category.icon}
                      </div>
                    </div>

                    {/* Bottom section with arrow */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-300">
                        Explore collection
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="relative bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
            <div className="absolute top-4 right-4 z-20">
              <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">🔥 Hot Deals</Badge>
            </div>
            <div className="space-y-2 mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Flash Sale
              </h2>
              <p className="text-muted-foreground">Limited time offers - grab them before they're gone!</p>
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Ends in 23:59:45</span>
              </div>
            </div>

            <div className="md:overflow-x-auto md:pb-4">
              <div className="grid grid-cols-1 gap-4 md:flex md:gap-4 md:min-w-max">
                {discountedProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="block">
                    <div className="bg-white dark:bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full md:w-72 md:flex-shrink-0 border border-red-100 dark:border-red-900/30 cursor-pointer">
                      <div className="relative">
                        <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1">
                          -{product.discount}% OFF
                        </Badge>
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-white/90 dark:bg-black/90 rounded-full px-2 py-1 text-xs font-medium">
                            Save ${(product.originalPrice - product.price).toFixed(2)}
                          </div>
                        </div>
                        <div className="aspect-square bg-muted relative overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-red-600 dark:text-red-400">${product.price}</span>
                            <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addToCart(product)
                            }}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
                            size="lg"
                          >
                            Add to Cart - Save ${(product.originalPrice - product.price).toFixed(2)}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Link href="/products?filter=deals">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent"
                >
                  View All Flash Deals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked favorites just for you</p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="block">
                <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Follow Us</h2>
            <p className="text-muted-foreground">Stay connected for the latest updates and exclusive offers</p>
          </div>
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <a
                href="https://instagram.com/teleshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-white dark:bg-card hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Instagram</p>
                  <p className="text-sm text-muted-foreground">@teleshop</p>
                </div>
              </a>

              <a
                href="https://facebook.com/teleshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-white dark:bg-card hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Facebook</p>
                  <p className="text-sm text-muted-foreground">TeleShop</p>
                </div>
              </a>

              <a
                href="https://twitter.com/teleshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-white dark:bg-card hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="w-6 h-6 text-white dark:text-black" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Twitter</p>
                  <p className="text-sm text-muted-foreground">@teleshop</p>
                </div>
              </a>

              <a
                href="https://youtube.com/teleshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-white dark:bg-card hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">YouTube</p>
                  <p className="text-sm text-muted-foreground">TeleShop</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Need Help?</h2>
            <p className="text-muted-foreground">Our support team is here to assist you 24/7</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">Get help over the phone</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm">
                  Have a question about your order, product, or need assistance? Call our support team at +1 (555)
                  123-4567.
                </p>
                <Button className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">Send us an email</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm">
                  Have a question about your order, product, or need assistance? Email us at support@teleshop.com.
                </p>
                <Button className="w-full" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {activeStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Story progress bars */}
            <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
              {storyContent[activeStory as keyof typeof storyContent]?.slides.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{
                      width: index < currentSlide ? "100%" : index === currentSlide ? `${slideProgress}%` : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={closeStory}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Story content */}
            {storyContent[activeStory as keyof typeof storyContent] && (
              <div className="relative w-full h-full">
                <img
                  src={
                    storyContent[activeStory as keyof typeof storyContent].slides[currentSlide].image ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt="Story"
                  className="w-full h-full object-cover"
                />

                {/* Story text overlay */}
                <div className="absolute bottom-20 left-4 right-4 z-10">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white text-lg font-medium">
                      {storyContent[activeStory as keyof typeof storyContent].slides[currentSlide].text}
                    </p>
                  </div>
                </div>

                {/* Navigation areas */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-0 w-1/3 h-full z-10 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-0 w-1/3 h-full z-10 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
                </button>

                {/* Tap areas for mobile */}
                <div className="absolute left-0 top-0 w-1/2 h-full z-10 md:hidden" onClick={prevSlide} />
                <div className="absolute right-0 top-0 w-1/2 h-full z-10 md:hidden" onClick={nextSlide} />
              </div>
            )}
          </div>
        </div>
      )}

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        total={cartTotal}
      />
    </div>
  )
}
