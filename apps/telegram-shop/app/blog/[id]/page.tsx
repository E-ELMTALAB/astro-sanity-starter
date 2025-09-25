"use client"

import { ShopHeader } from "@/components/shop-header"
import { ShoppingCart } from "@/components/shopping-cart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, ShoppingBag, Star, BookOpen, Lightbulb, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
  type?: "promotional" | "educational"
  steps?: {
    title: string
    description: string
    details?: string[]
    code?: string
    language?: string
    warning?: string
  }[]
  tips?: string[]
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Summer Fashion Trends 2024: Elevate Your Style",
    excerpt: "Discover the hottest fashion trends this summer and find the perfect pieces in our collection.",
    content: `Summer is here and it's time to refresh your wardrobe with the latest trends that are taking the fashion world by storm. This season is all about embracing vibrant colors, flowing fabrics, and statement pieces that make you feel confident and stylish.

**Floral Patterns Are Back**
One of the biggest trends this summer is the return of floral patterns. From delicate botanical prints to bold tropical designs, flowers are blooming everywhere in fashion. Our elegant evening dress collection features stunning floral patterns that are perfect for summer events and special occasions.

**Sustainable Fashion Choices**
More than ever, consumers are looking for sustainable and ethically-made clothing options. We're proud to offer a curated selection of eco-friendly fashion pieces that don't compromise on style or quality.

**Versatile Pieces for Every Occasion**
The key to a great summer wardrobe is versatility. Look for pieces that can easily transition from day to night, from casual to formal. Our collection includes versatile dresses that can be dressed up with accessories or kept simple for everyday wear.`,
    image: "/summer-floral-dress.jpg",
    author: "Sarah Johnson",
    date: "2024-06-15",
    readTime: "5 min read",
    category: "Fashion",
    featuredProducts: ["7", "2"],
    type: "promotional",
  },
  {
    id: "2",
    title: "Tech Essentials for Remote Work Success",
    excerpt: "Boost your productivity with these must-have tech gadgets for your home office setup.",
    content: `Working from home has become the new normal, and having the right tech setup can make all the difference in your productivity and comfort. Here are the essential gadgets every remote worker needs.

**Audio Quality Matters**
Clear audio is crucial for video calls and focus. Our premium wireless headphones offer noise cancellation and crystal-clear sound quality, making them perfect for both work calls and relaxation.

**Ergonomic Workspace**
Creating an ergonomic workspace is essential for long-term health and productivity. Invest in quality peripherals that support good posture and reduce strain.

**Stay Connected**
Reliable connectivity tools ensure you never miss an important meeting or deadline. Our tech collection includes everything you need to stay connected and productive.`,
    image: "/modern-wireless-headphones.jpg",
    author: "Mike Chen",
    date: "2024-06-10",
    readTime: "7 min read",
    category: "Technology",
    featuredProducts: ["1", "3"],
    type: "promotional",
  },
  {
    id: "3",
    title: "Fitness Goals Made Easy: Essential Gear Guide",
    excerpt: "Achieve your fitness goals with the right equipment and accessories from our sports collection.",
    content: `Starting a fitness journey can be overwhelming, but having the right gear can make all the difference. Here's your complete guide to essential fitness equipment that will help you stay motivated and track your progress.

**Track Your Progress**
A good fitness tracker is essential for monitoring your daily activity, heart rate, and sleep patterns. Our selection of fitness trackers offers advanced features to help you reach your goals.

**Comfort and Performance**
The right workout gear should be comfortable, breathable, and designed for performance. Look for moisture-wicking fabrics and ergonomic designs.

**Stay Motivated**
Having quality equipment that you enjoy using is key to maintaining a consistent fitness routine. Invest in pieces that make you excited to work out.`,
    image: "/fitness-tracker-lifestyle.png",
    author: "Emma Davis",
    date: "2024-06-05",
    readTime: "6 min read",
    category: "Fitness",
    featuredProducts: ["4", "6"],
    type: "promotional",
  },
  {
    id: "4",
    title: "Complete Guide to Product Photography: From Setup to Edit",
    excerpt: "Master the art of product photography with this comprehensive step-by-step tutorial.",
    content: `Product photography is essential for showcasing your items in the best light. Whether you're selling online or building a portfolio, these techniques will help you capture stunning product images.`,
    image: "/modern-wireless-headphones.jpg",
    author: "Alex Rivera",
    date: "2024-06-20",
    readTime: "12 min read",
    category: "Photography",
    featuredProducts: ["1"],
    type: "educational",
    steps: [
      {
        title: "Set up your lighting equipment",
        description:
          "Proper lighting is the foundation of great product photography. You'll need at least two light sources for professional results.",
        details: [
          "Position your key light at a 45-degree angle to your product",
          "Place a fill light on the opposite side to reduce harsh shadows",
          "Use diffusers to soften the light and create even illumination",
          "Consider adding a background light to separate your product from the backdrop",
        ],
        warning: "Never use direct flash as it creates harsh shadows and unflattering reflections",
      },
      {
        title: "Choose and prepare your background",
        description: "A clean, distraction-free background helps your product stand out and look professional.",
        details: [
          "White seamless paper is ideal for most products",
          "Ensure the background extends beyond your frame",
          "Remove any wrinkles or dust spots",
          "For reflective products, consider using a gradient background",
        ],
      },
      {
        title: "Configure your camera settings",
        description: "Manual camera settings give you complete control over the final image quality.",
        details: [
          "Set ISO to 100 for minimal noise",
          "Use aperture f/8 to f/11 for optimal sharpness",
          "Adjust shutter speed based on your lighting setup",
          "Shoot in RAW format for maximum editing flexibility",
        ],
        code: `// Camera Settings Checklist
ISO: 100
Aperture: f/8 - f/11
Shutter Speed: 1/60s - 1/125s
Format: RAW
White Balance: Daylight (5600K)
Focus Mode: Single Point AF`,
        language: "text",
      },
      {
        title: "Position and compose your shot",
        description: "Product positioning and composition can make or break your photograph.",
        details: [
          "Show the product's most important features prominently",
          "Use the rule of thirds for dynamic composition",
          "Ensure the product is perfectly level and straight",
          "Take shots from multiple angles - front, side, top, and detail shots",
        ],
      },
      {
        title: "Post-processing workflow",
        description: "Professional editing transforms good photos into exceptional ones.",
        details: [
          "Import RAW files into Lightroom or Photoshop",
          "Adjust basic exposure, highlights, and shadows",
          "Fine-tune white balance for accurate colors",
          "Remove dust spots and minor imperfections",
          "Apply lens corrections and chromatic aberration removal",
        ],
        code: `/* Basic Lightroom Adjustments */
Exposure: +0.3 to +0.7
Highlights: -50 to -100
Shadows: +30 to +50
Whites: +20 to +40
Blacks: -10 to -20
Clarity: +10 to +25
Vibrance: +15 to +30`,
        language: "css",
      },
    ],
    tips: [
      "Use a tripod to ensure sharp, consistent images",
      "Shoot in RAW format for maximum editing flexibility",
      "Take reference shots with a color checker for accurate colors",
      "Keep your lens clean - dust spots are easily visible on product photos",
    ],
  },
  {
    id: "5",
    title: "Smart Home Setup: Complete Beginner's Guide",
    excerpt: "Transform your home into a smart home with this comprehensive setup guide.",
    content: `Creating a smart home doesn't have to be complicated. This guide will walk you through everything you need to know to get started.`,
    image: "/sleek-smartwatch.jpg",
    author: "Jordan Kim",
    date: "2024-06-18",
    readTime: "15 min read",
    category: "Technology",
    featuredProducts: ["2", "3"],
    type: "educational",
    steps: [
      {
        title: "Assess your home's smart potential",
        description:
          "Before buying any devices, evaluate your current setup and identify the best automation opportunities.",
        details: [
          "Check your Wi-Fi coverage in all areas where you want smart devices",
          "List daily routines that could benefit from automation",
          "Identify security vulnerabilities that smart devices could address",
          "Consider your budget and prioritize the most impactful upgrades first",
        ],
      },
      {
        title: "Choose your smart home ecosystem",
        description: "Selecting the right platform ensures all your devices work together seamlessly.",
        details: [
          "Google Home: Best for Android users and Google services integration",
          "Amazon Alexa: Widest device compatibility and voice control",
          "Apple HomeKit: Most secure option, perfect for iPhone users",
          "Samsung SmartThings: Great for mixed-brand device environments",
        ],
        warning: "Avoid mixing ecosystems initially - stick to one platform for better compatibility",
      },
      {
        title: "Install your smart hub and basic devices",
        description: "Start with essential devices that provide immediate value and build from there.",
        details: [
          "Set up your smart hub or central controller first",
          "Install smart bulbs in frequently used rooms",
          "Add smart plugs for lamps and appliances",
          "Configure a smart speaker for voice control",
        ],
        code: `# Basic Device Setup Checklist
□ Smart Hub/Controller
□ 3-5 Smart Bulbs (living room, bedroom, kitchen)
□ 2-3 Smart Plugs (lamps, coffee maker)
□ 1 Smart Speaker (central location)
□ Smart Thermostat (if compatible)`,
        language: "markdown",
      },
      {
        title: "Create your first automations",
        description: "Simple automations provide immediate benefits and help you understand the system's capabilities.",
        details: [
          "Set up sunrise/sunset lighting schedules",
          "Create a 'Good Morning' scene that turns on lights and starts coffee",
          "Configure a 'Good Night' routine that locks doors and turns off lights",
          "Set up presence detection to turn lights on when you arrive home",
        ],
        code: `// Example Google Home Automation
{
  "name": "Good Morning",
  "trigger": "7:00 AM weekdays",
  "actions": [
    "Turn on bedroom lights to 50%",
    "Start coffee maker",
    "Set thermostat to 72°F",
    "Play morning news briefing"
  ]
}`,
        language: "json",
      },
    ],
    tips: [
      "Start small and expand gradually to avoid overwhelming yourself",
      "Ensure your Wi-Fi network can handle multiple connected devices",
      "Keep device firmware updated for security and performance",
      "Create a backup plan in case your internet goes down",
    ],
  },
]

const allProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "/modern-wireless-headphones.jpg",
    rating: 4.8,
  },
  { id: "2", name: "Smart Fitness Watch", price: 249.99, image: "/sleek-smartwatch.jpg", rating: 4.6 },
  { id: "3", name: "Wireless Gaming Mouse", price: 79.99, image: "/gaming-mouse.png", rating: 4.7 },
  { id: "4", name: "Fitness Tracker Pro", price: 199.99, image: "/fitness-tracker-lifestyle.png", rating: 4.5 },
  { id: "6", name: "Bluetooth Earbuds", price: 149.99, image: "/wireless-earbuds.png", rating: 4.4 },
  { id: "7", name: "Elegant Evening Dress", price: 189.99, image: "/elegant-evening-dress.jpg", rating: 4.9 },
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [cartItems, setCartItems] = useState<any[]>([])
  const router = useRouter()

  const post = blogPosts.find((p) => p.id === params.id)

  useEffect(() => {
    if (!post) {
      router.push("/blog")
    }
  }, [post, router])

  if (!post) {
    return null
  }

  const featuredProducts = allProducts.filter((product) => post.featuredProducts.includes(product.id))

  const addToCart = (product: Product) => {
    setCartItemCount((prev) => prev + 1)
    setCartItems((prev) => [...prev, { ...product, quantity: 1 }])
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
      setCartItemCount((prev) => Math.max(0, prev - 1))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="max-w-none bg-white dark:bg-gray-900">
        {/* Navigation and header section */}
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Article header */}
          <header className="space-y-6 pb-8 border-b border-gray-200 dark:border-gray-700">
            <Badge
              className={`${
                post.type === "educational"
                  ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1"
                  : "bg-primary/10 text-primary hover:bg-primary/20 text-sm px-3 py-1"
              }`}
            >
              {post.type === "educational" ? "📚 Tutorial Guide" : post.category}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white font-serif">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{post.excerpt}</p>

            <div className="flex items-center space-x-8 text-gray-500 dark:text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>
        </div>

        {/* Hero image */}
        <div className="w-full aspect-[16/9] max-h-96 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article content */}
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <article className="space-y-12">
            {post.type === "educational" ? (
              <div className="space-y-12">
                {/* Introduction */}
                <div className="prose prose-xl max-w-none">
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-8 border-l-4 border-blue-500">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">What You'll Learn</h2>
                        <p className="text-blue-800 dark:text-blue-200 text-lg leading-relaxed">{post.content}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps section */}
                {post.steps && (
                  <section className="space-y-8">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Step-by-Step Instructions</h2>
                      <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-8">
                      {post.steps.map((step, index) => (
                        <div key={index} className="group">
                          <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-start space-x-6">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>

                                {step.details && (
                                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                                      Detailed Instructions:
                                    </h4>
                                    <ul className="space-y-3">
                                      {step.details.map((detail, detailIndex) => (
                                        <li key={detailIndex} className="flex items-start space-x-3">
                                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                          <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {step.code && (
                                  <div className="bg-gray-900 dark:bg-black rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
                                      <span className="text-sm font-medium text-gray-300">
                                        {step.language === "json"
                                          ? "JSON Configuration"
                                          : step.language === "css"
                                            ? "Settings"
                                            : step.language === "markdown"
                                              ? "Checklist"
                                              : "Code"}
                                      </span>
                                      <button className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
                                        Copy
                                      </button>
                                    </div>
                                    <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                                      <code>{step.code}</code>
                                    </pre>
                                  </div>
                                )}

                                {step.warning && (
                                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                    <div className="flex items-start space-x-3">
                                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <h5 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                                          Important Warning
                                        </h5>
                                        <p className="text-red-700 dark:text-red-300 text-sm">{step.warning}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Tips section */}
                {post.tips && (
                  <section className="space-y-8">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Expert Tips</h2>
                      <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-xl">
                          <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">Pro Tips for Success</h3>
                      </div>

                      <div className="grid gap-4">
                        {post.tips.map((tip, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                              <AlertCircle className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-amber-900 dark:text-amber-100 text-lg leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="prose prose-xl max-w-none">
                {post.content.split("\n\n").map((paragraph, index) => (
                  <div key={index} className="mb-8">
                    {paragraph.startsWith("**") && paragraph.endsWith("**") ? (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                        {paragraph.slice(2, -2)}
                      </h2>
                    ) : (
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{paragraph}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Featured products section */}
            {featuredProducts.length > 0 && (
              <section className="space-y-8 pt-12 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {post.type === "educational" ? "Recommended Tools & Equipment" : "Featured Products"}
                  </h2>
                  <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {featuredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                    >
                      <div className="flex h-32">
                        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-6 space-y-3">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{product.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xl text-primary">${product.price}</span>
                            <div className="flex space-x-3">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/product/${product.id}`}>View Details</Link>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => addToCart(product)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </article>
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
