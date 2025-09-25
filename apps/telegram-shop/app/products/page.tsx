"use client"

import { useState } from "react"
import { ShopHeader } from "@/components/shop-header"
import { ProductGrid } from "@/components/product-grid"
import { ShoppingCart } from "@/components/shopping-cart"
import { SearchFilters } from "@/components/search-filters"

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

const sampleProducts: Product[] = [
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
    id: "3",
    name: "Coffee Maker",
    price: 79.99,
    image: "/modern-coffee-maker.png",
    category: "Home",
    rating: 4.3,
    description: "Programmable drip coffee maker with thermal carafe",
  },
  {
    id: "4",
    name: "Yoga Mat",
    price: 29.99,
    image: "/premium-yoga-mat.png",
    category: "Fitness",
    rating: 4.6,
    description: "Non-slip eco-friendly yoga mat",
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
  {
    id: "6",
    name: "Running Shoes",
    price: 129.99,
    image: "/athletic-running-shoes.jpg",
    category: "Fashion",
    rating: 4.7,
    description: "Lightweight running shoes with advanced cushioning",
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
]

export default function ProductsPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")

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

  const filteredProducts = sampleProducts
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === "All" || product.category === selectedCategory),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection</p>
        </div>

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
      </main>

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
