"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShopHeader } from "@/components/shop-header"
import { ShoppingCart } from "@/components/shopping-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, ArrowLeft, Plus, Minus, Heart, Share2, CarIcon as CartIcon, Sparkles } from "lucide-react"
import Link from "next/link"
import type { Product, CartItem } from "@/app/page"

// Sample product data - in a real app, this would come from an API
const allProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    image: "/modern-wireless-headphones.jpg",
    category: "Electronics",
    rating: 4.5,
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 249.99,
    image: "/sleek-smartwatch.jpg",
    category: "Electronics",
    rating: 4.8,
    description:
      "Advanced fitness tracking smartwatch with GPS, heart rate monitoring, sleep tracking, and smartphone notifications. Water-resistant design with 7-day battery life.",
  },
  {
    id: "5",
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "/portable-bluetooth-speaker.jpg",
    category: "Electronics",
    rating: 4.4,
    description:
      "Waterproof portable Bluetooth speaker with 360-degree sound, 12-hour battery life, and deep bass. Perfect for outdoor adventures and home entertainment.",
  },
  {
    id: "7",
    name: "Elegant Evening Dress",
    price: 189.99,
    image: "/elegant-evening-dress.jpg",
    category: "Fashion",
    rating: 4.9,
    description: "Stunning black evening dress perfect for special occasions and formal events",
  },
  {
    id: "d1",
    name: "Gaming Mouse",
    price: 39.99,
    image: "/gaming-mouse.png",
    category: "Electronics",
    rating: 4.6,
    description:
      "High-precision gaming mouse with customizable RGB lighting, programmable buttons, and ergonomic design. Features 16,000 DPI sensor for competitive gaming.",
  },
  {
    id: "d2",
    name: "Wireless Earbuds",
    price: 59.99,
    image: "/wireless-earbuds.png",
    category: "Electronics",
    rating: 4.3,
    description:
      "True wireless earbuds with active noise cancellation, touch controls, and wireless charging case. Enjoy up to 24 hours of total playback time.",
  },
  {
    id: "d3",
    name: "Fitness Tracker",
    price: 79.99,
    image: "/fitness-tracker-lifestyle.png",
    category: "Fitness",
    rating: 4.5,
    description:
      "Advanced fitness tracker with heart rate monitoring, sleep analysis, and 20+ workout modes. Track your health goals with precision and style.",
  },
  {
    id: "dress1",
    name: "Elegant Evening Dress",
    price: 149.99,
    image: "/elegant-evening-dress.jpg",
    category: "Fashion",
    rating: 4.7,
    description:
      "Stunning evening dress with flowing silhouette and elegant design. Perfect for special occasions, formal events, and romantic dinners.",
  },
  {
    id: "dress2",
    name: "Summer Floral Dress",
    price: 89.99,
    image: "/summer-floral-dress.jpg",
    category: "Fashion",
    rating: 4.5,
    description:
      "Light and breezy summer dress with beautiful floral patterns. Comfortable cotton blend fabric perfect for warm weather and casual outings.",
  },
]

const reviews = [
  {
    id: "1",
    user: "Sarah M.",
    rating: 5,
    comment:
      "Amazing quality! Exceeded my expectations. The sound quality is incredible and the battery life is exactly as advertised.",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "2",
    user: "Mike R.",
    rating: 4,
    comment:
      "Great product, fast shipping. Very satisfied with the purchase. Only minor issue is the setup process could be simpler.",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "3",
    user: "Emma L.",
    rating: 5,
    comment:
      "Perfect for my daily workouts. Comfortable fit and excellent build quality. Would definitely recommend to others!",
    date: "2 weeks ago",
    verified: true,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState(false)
  const [userImage, setUserImage] = useState<string | null>(null)

  const product = allProducts.find((p) => p.id === params.id)

  useEffect(() => {
    if (!product) {
      router.push("/products")
    }
  }, [product, router])

  if (!product) {
    return null
  }

  const addToCart = (productToAdd: Product, qty = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productToAdd.id)
      if (existingItem) {
        return prev.map((item) => (item.id === productToAdd.id ? { ...item, quantity: item.quantity + qty } : item))
      }
      return [...prev, { ...productToAdd, quantity: qty }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const productImages = [product.image, product.image, product.image]

  const technicalSpecs = {
    "Wireless Headphones": [
      { label: "Driver Size", value: "40mm Dynamic" },
      { label: "Frequency Response", value: "20Hz - 20kHz" },
      { label: "Battery Life", value: "30 hours" },
      { label: "Charging Time", value: "2 hours" },
      { label: "Bluetooth Version", value: "5.0" },
      { label: "Weight", value: "250g" },
      { label: "Noise Cancellation", value: "Active ANC" },
      { label: "Warranty", value: "2 years" },
    ],
    "Smart Watch": [
      { label: "Display", value: '1.4" AMOLED' },
      { label: "Resolution", value: "454 x 454 pixels" },
      { label: "Battery Life", value: "7 days" },
      { label: "Water Resistance", value: "5ATM" },
      { label: "GPS", value: "Built-in GPS + GLONASS" },
      { label: "Sensors", value: "Heart Rate, SpO2, Accelerometer" },
      { label: "Connectivity", value: "Bluetooth 5.0, Wi-Fi" },
      { label: "Compatibility", value: "iOS 12+, Android 6+" },
    ],
    "Gaming Mouse": [
      { label: "DPI", value: "16,000 DPI" },
      { label: "Sensor", value: "Optical PMW3389" },
      { label: "Polling Rate", value: "1000Hz" },
      { label: "Buttons", value: "8 Programmable" },
      { label: "RGB Lighting", value: "16.8M Colors" },
      { label: "Cable Length", value: "1.8m Braided" },
      { label: "Weight", value: "85g" },
      { label: "Compatibility", value: "Windows, macOS, Linux" },
    ],
  }

  const currentSpecs = technicalSpecs[product.name as keyof typeof technicalSpecs] || [
    { label: "Brand", value: "TeleShop" },
    { label: "Model", value: product.name },
    { label: "Category", value: product.category },
    { label: "Rating", value: `${product.rating}/5` },
    { label: "Warranty", value: "1 year" },
    { label: "Return Policy", value: "30 days" },
  ]

  const handleTryOn = async () => {
    if (!product) return

    setIsTryOnOpen(true)
    setIsGeneratingTryOn(true)
    setTryOnResult(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setTryOnResult("/person-wearing.jpg" + product.name)
    } catch (error) {
      console.error("Try-on generation failed:", error)
    } finally {
      setIsGeneratingTryOn(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const isDress = product?.category === "Fashion" && product?.name.toLowerCase().includes("dress")

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              <img
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <h1 className="text-3xl font-bold text-balance">{product.name}</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "text-red-500 border-red-200" : ""}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">(127 reviews)</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary">${product.price}</div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 gap-2" onClick={() => addToCart(product, quantity)}>
                  <CartIcon className="w-5 h-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
                <Link href="/checkout">
                  <Button size="lg" variant="outline">
                    Buy Now
                  </Button>
                </Link>
              </div>

              {isDress && (
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg"
                  onClick={handleTryOn}
                >
                  <Sparkles className="w-5 h-5" />
                  Try On with AI
                </Button>
              )}
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Product Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Free shipping on orders over $50</li>
                  <li>• 30-day return policy</li>
                  <li>• 1-year manufacturer warranty</li>
                  <li>• Secure payment processing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-primary/5 to-blue-50/80 dark:from-gray-900/90 dark:via-primary/10 dark:to-blue-950/30 backdrop-blur-xl border border-white/20 dark:border-gray-800/30 shadow-2xl shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-blue-500/10 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          <Tabs defaultValue="overview" className="relative space-y-6 md:space-y-10 p-4 md:p-8">
            <TabsList className="relative grid w-full grid-cols-1 sm:grid-cols-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-2xl p-1 md:p-2 h-auto shadow-xl shadow-primary/5 before:absolute before:inset-0 before:rounded-2xl md:before:rounded-3xl before:bg-gradient-to-r before:from-primary/5 before:to-blue-500/5 before:pointer-events-none gap-1 sm:gap-0">
              <TabsTrigger
                value="overview"
                className="relative flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-3 md:px-6 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/25 data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-102 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 md:gap-3">
                  <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 group-data-[state=active]:from-white/30 group-data-[state=active]:to-white/30 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-primary to-blue-500 group-data-[state=active]:from-white group-data-[state=active]:to-white shadow-lg"></div>
                  </div>
                  <span className="font-semibold text-xs md:text-sm tracking-wide">Overview</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="specs"
                className="relative flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-3 md:px-6 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/25 data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-102 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 md:gap-3">
                  <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 group-data-[state=active]:from-white/30 group-data-[state=active]:to-white/30 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-primary to-blue-500 group-data-[state=active]:from-white group-data-[state=active]:to-white shadow-lg"></div>
                  </div>
                  <span className="font-semibold text-xs md:text-sm tracking-wide">
                    <span className="sm:hidden">Specs</span>
                    <span className="hidden sm:inline">Specifications</span>
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="reviews"
                className="relative flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-3 md:px-6 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/25 data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-102 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 md:gap-3">
                  <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 group-data-[state=active]:from-white/30 group-data-[state=active]:to-white/30 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-primary to-blue-500 group-data-[state=active]:from-white group-data-[state=active]:to-white shadow-lg"></div>
                  </div>
                  <span className="font-semibold text-xs md:text-sm tracking-wide">Reviews</span>
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-gradient-to-r from-primary/20 to-blue-500/20 group-data-[state=active]:from-white/30 group-data-[state=active]:to-white/30 text-primary group-data-[state=active]:text-white border-primary/30 group-data-[state=active]:border-white/30 text-xs md:text-sm px-1.5 md:px-2 py-0.5 md:py-1 shadow-lg backdrop-blur-sm"
                  >
                    {reviews.length}
                  </Badge>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="space-y-4 md:space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl shadow-primary/10 bg-gradient-to-br from-white/80 via-white/60 to-primary/5 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-primary/10 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/10 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                <CardContent className="relative p-4 md:p-10 space-y-4 md:space-y-8">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center shadow-2xl shadow-primary/25">
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-primary to-blue-500"></div>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Product Overview
                    </h3>
                  </div>

                  <div className="relative bg-gradient-to-r from-primary/8 via-primary/5 to-blue-500/8 rounded-xl md:rounded-2xl p-4 md:p-8 border border-primary/20 backdrop-blur-sm shadow-xl shadow-primary/5 before:absolute before:inset-0 before:rounded-xl md:before:rounded-2xl before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-blue-500 rounded-full"></div>
                    <p className="text-muted-foreground text-sm md:text-lg leading-relaxed pl-4 md:pl-6">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="specs"
              className="space-y-4 md:space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl shadow-primary/10 bg-gradient-to-br from-white/80 via-white/60 to-primary/5 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-primary/10 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/10 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                <CardContent className="relative p-4 md:p-10 space-y-4 md:space-y-8">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center shadow-2xl shadow-primary/25">
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-primary to-blue-500"></div>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      <span className="sm:hidden">Specifications</span>
                      <span className="hidden sm:inline">Technical Specifications</span>
                    </h3>
                  </div>

                  <div className="relative bg-gradient-to-r from-primary/8 via-primary/5 to-blue-500/8 rounded-xl md:rounded-2xl p-4 md:p-8 border border-primary/20 backdrop-blur-sm shadow-xl shadow-primary/5">
                    <div className="grid gap-1 md:gap-2">
                      {currentSpecs.map((spec, index) => (
                        <div
                          key={index}
                          className="group flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 md:py-5 px-3 md:px-6 rounded-lg md:rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] gap-1 sm:gap-0"
                        >
                          <span className="font-medium text-muted-foreground flex items-center gap-2 md:gap-3 text-sm md:text-base">
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-primary to-blue-500 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                            {spec.label}
                          </span>
                          <span className="font-semibold bg-gradient-to-r from-primary/15 to-blue-500/15 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-primary border border-primary/20 shadow-lg backdrop-blur-sm group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-300 text-sm md:text-base ml-5 sm:ml-0">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="reviews"
              className="space-y-4 md:space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-8 gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center shadow-2xl shadow-primary/25">
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-primary to-blue-500"></div>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Customer Reviews
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-primary/15 to-blue-500/15 text-primary border-primary/30 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm shadow-lg backdrop-blur-sm"
                  >
                    {reviews.length} Reviews
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-blue-500/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 text-sm md:text-base"
                >
                  Write a Review
                </Button>
              </div>

              <div className="grid gap-6">
                {reviews.map((review, index) => (
                  <Card
                    key={review.id}
                    className="border-primary/20 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.user}</span>
                                {review.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-700 border-green-200"
                                  >
                                    ✓ Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
                          {review.date}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-primary/8 via-primary/5 to-blue-500/8 rounded-2xl p-4 border border-primary/20 backdrop-blur-sm shadow-xl shadow-primary/5">
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">You Might Also Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {allProducts
              .filter((p) => p.id !== product.id && p.category === product.category)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
                        <img
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-balance">{relatedProduct.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${relatedProduct.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{relatedProduct.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Dialog open={isTryOnOpen} onOpenChange={setIsTryOnOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Virtual Try-On
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {isGeneratingTryOn ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">Generating your virtual try-on...</h3>
                  <p className="text-sm text-muted-foreground">Our AI is creating a personalized fit just for you</p>
                </div>
              </div>
            ) : tryOnResult ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Original Product</h4>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={product?.image || "/placeholder.svg"}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Upload Your Photo</h4>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
                      {userImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={userImage || "/placeholder.svg"}
                            alt="Your uploaded photo"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUserImage(null)}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Plus className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="font-medium text-primary">Upload Your Photo</p>
                              <p className="text-sm text-muted-foreground">Click to select an image</p>
                            </div>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      addToCart(product!, quantity)
                      setIsTryOnOpen(false)
                    }}
                    disabled={!userImage}
                  >
                    <CartIcon className="w-4 h-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" onClick={() => setIsTryOnOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Something went wrong. Please try again.</p>
                <Button variant="outline" onClick={handleTryOn} className="mt-4 bg-transparent">
                  Retry
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
