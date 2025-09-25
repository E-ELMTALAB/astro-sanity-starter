"use client"

import { ShopHeader } from "@/components/shop-header"
import { ShoppingCart } from "@/components/shopping-cart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  readTime: string
  category: string
  featuredProducts: string[]
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Summer Fashion Trends 2024: Elevate Your Style",
    excerpt: "Discover the hottest fashion trends this summer and find the perfect pieces in our collection.",
    content: "Summer is here and it's time to refresh your wardrobe...",
    image: "/summer-floral-dress.jpg",
    author: "Sarah Johnson",
    date: "2024-06-15",
    readTime: "5 min read",
    category: "Fashion",
    featuredProducts: ["7", "2"],
  },
  {
    id: "2",
    title: "Tech Essentials for Remote Work Success",
    excerpt: "Boost your productivity with these must-have tech gadgets for your home office setup.",
    content: "Working from home has become the new normal...",
    image: "/modern-wireless-headphones.jpg",
    author: "Mike Chen",
    date: "2024-06-10",
    readTime: "7 min read",
    category: "Technology",
    featuredProducts: ["1", "3"],
  },
  {
    id: "3",
    title: "Fitness Goals Made Easy: Essential Gear Guide",
    excerpt: "Achieve your fitness goals with the right equipment and accessories from our sports collection.",
    content: "Starting a fitness journey can be overwhelming...",
    image: "/fitness-tracker-lifestyle.png",
    author: "Emma Davis",
    date: "2024-06-05",
    readTime: "6 min read",
    category: "Fitness",
    featuredProducts: ["4", "6"],
  },
  {
    id: "4",
    title: "Photography Basics: How to Take Professional Product Photos at Home",
    excerpt: "Learn the fundamentals of product photography using just your smartphone and basic lighting setup.",
    content: "Great product photos can make or break your online sales...",
    image: "/modern-wireless-headphones.jpg",
    author: "Alex Rivera",
    date: "2024-06-20",
    readTime: "8 min read",
    category: "Tutorial",
    featuredProducts: ["1", "2"],
  },
  {
    id: "5",
    title: "Complete Guide to Smart Home Setup for Beginners",
    excerpt: "Step-by-step tutorial on creating your first smart home ecosystem without breaking the bank.",
    content: "Smart homes aren't just for tech experts anymore...",
    image: "/sleek-smartwatch.jpg",
    author: "David Kim",
    date: "2024-06-18",
    readTime: "12 min read",
    category: "Tutorial",
    featuredProducts: ["2", "3"],
  },
  {
    id: "6",
    title: "DIY Fashion: How to Customize Your Wardrobe on a Budget",
    excerpt: "Transform your existing clothes into trendy pieces with these simple techniques and affordable tools.",
    content: "Fashion doesn't have to be expensive to be stylish...",
    image: "/elegant-evening-dress.jpg",
    author: "Lisa Thompson",
    date: "2024-06-16",
    readTime: "10 min read",
    category: "DIY",
    featuredProducts: ["7"],
  },
  {
    id: "7",
    title: "Meal Prep Mastery: Kitchen Organization and Time-Saving Tips",
    excerpt: "Master the art of meal preparation with proper kitchen organization and essential tools.",
    content: "Meal prepping can save you hours each week...",
    image: "/fitness-tracker-lifestyle.png",
    author: "Chef Maria Santos",
    date: "2024-06-14",
    readTime: "9 min read",
    category: "Lifestyle",
    featuredProducts: ["4", "6"],
  },
  {
    id: "8",
    title: "Digital Wellness: Managing Screen Time and Creating Healthy Tech Habits",
    excerpt: "Learn practical strategies to maintain a healthy relationship with technology in our digital age.",
    content: "In our hyper-connected world, digital wellness has become crucial...",
    image: "/modern-wireless-headphones.jpg",
    author: "Dr. Jennifer Park",
    date: "2024-06-12",
    readTime: "7 min read",
    category: "Wellness",
    featuredProducts: ["1", "4"],
  },
]

export default function BlogPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItemCount] = useState(0)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [cartTotal] = useState(0)

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            TeleShop Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest trends, product reviews, and shopping tips to enhance your lifestyle
          </p>
        </div>

        {/* Featured Post */}
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={blogPosts[0].image || "/placeholder.svg"}
                alt={blogPosts[0].title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <CardContent className="md:w-1/2 p-8 space-y-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Featured Post</Badge>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">{blogPosts[0].title}</h2>
              <p className="text-muted-foreground text-lg">{blogPosts[0].excerpt}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blogPosts[0].date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{blogPosts[0].readTime}</span>
                </div>
              </div>
              <Button asChild className="group">
                <Link href={`/blog/${blogPosts[0].id}`}>
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Blog Posts Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="group/btn">
                      <Link href={`/blog/${post.id}`}>
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
