"use client"

import { useState } from "react"
import Link from "next/link"
import { ShopHeader } from "@/components/shop-header"
import { ShoppingCart } from "@/components/shopping-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, TrendingUp, File as Fire, ArrowRight } from "lucide-react"

interface TrendingProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  trendingRank: number
  weeklyGrowth: number
  views: number
  likes: number
  description: string
}

const trendingProducts: TrendingProduct[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 199.99,
    originalPrice: 249.99,
    image: "/modern-wireless-headphones.jpg",
    rating: 4.8,
    reviews: 2847,
    category: "Electronics",
    trendingRank: 1,
    weeklyGrowth: 156,
    views: 45230,
    likes: 3420,
    description: "Industry-leading noise cancellation with premium sound quality",
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 299.99,
    originalPrice: 399.99,
    image: "/sleek-smartwatch.jpg",
    rating: 4.7,
    reviews: 1923,
    category: "Electronics",
    trendingRank: 2,
    weeklyGrowth: 134,
    views: 38940,
    likes: 2890,
    description: "Advanced health monitoring with GPS and 7-day battery life",
  },
  {
    id: "7",
    name: "Elegant Evening Dress",
    price: 189.99,
    image: "/elegant-evening-dress.jpg",
    rating: 4.9,
    reviews: 856,
    category: "Fashion",
    trendingRank: 3,
    weeklyGrowth: 98,
    views: 29340,
    likes: 2156,
    description: "Stunning black evening dress perfect for special occasions",
  },
  {
    id: "3",
    name: "Gaming Mouse Pro",
    price: 79.99,
    originalPrice: 99.99,
    image: "/gaming-mouse.png",
    rating: 4.6,
    reviews: 1456,
    category: "Electronics",
    trendingRank: 4,
    weeklyGrowth: 87,
    views: 25670,
    likes: 1890,
    description: "High-precision gaming mouse with customizable RGB lighting",
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    price: 129.99,
    originalPrice: 159.99,
    image: "/wireless-earbuds.png",
    rating: 4.5,
    reviews: 2134,
    category: "Electronics",
    trendingRank: 5,
    weeklyGrowth: 76,
    views: 22340,
    likes: 1567,
    description: "True wireless earbuds with active noise cancellation",
  },
  {
    id: "5",
    name: "Fitness Tracker Band",
    price: 89.99,
    originalPrice: 119.99,
    image: "/fitness-tracker-lifestyle.png",
    rating: 4.4,
    reviews: 987,
    category: "Electronics",
    trendingRank: 6,
    weeklyGrowth: 65,
    views: 18920,
    likes: 1234,
    description: "24/7 health monitoring with sleep and workout tracking",
  },
]

export default function TrendingPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const addToCart = (product: TrendingProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Fire className="w-6 h-6 text-orange-500" />
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Trending Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Popular items loved by thousands of customers
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Most Popular Right Now</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white">#{product.trendingRank}</Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90">
                      <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                      {product.rating}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>

                    <Button onClick={() => addToCart(product)} size="sm" className="bg-primary hover:bg-primary/90">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center py-8">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        total={cartTotal}
      />
    </div>
  )
}
