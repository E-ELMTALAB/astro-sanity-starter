"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Send, Bot, User, Sparkles, ShoppingCart, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  products?: Array<{
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    category: string
  }>
}

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Show onboarding tooltip on first visit
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem("ai-assistant-tooltip-seen")
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Hide tooltip after 5 seconds or when assistant is opened
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false)
        localStorage.setItem("ai-assistant-tooltip-seen", "true")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "1",
          content:
            "Hi! I'm your AI shopping assistant. I can help you find the perfect products, compare prices, and answer any questions about our store. What are you looking for today?",
          isUser: false,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length])

  const quickQuestions = [
    "Show me trending products",
    "Best deals under $100",
    "Electronics on sale",
    "Gift recommendations",
  ]

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response with product recommendations
    setTimeout(() => {
      const aiResponse = generateAIResponse(message)
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("trending") || lowerMessage.includes("popular")) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Here are our trending products right now! These are flying off the shelves:",
        isUser: false,
        timestamp: new Date(),
        products: [
          {
            id: "1",
            name: "Wireless Headphones Pro",
            price: 79.99,
            originalPrice: 129.99,
            image: "/modern-wireless-headphones.jpg",
            rating: 4.8,
            category: "Electronics",
          },
          {
            id: "2",
            name: "Smart Fitness Watch",
            price: 199.99,
            image: "/sleek-smartwatch.jpg",
            rating: 4.6,
            category: "Wearables",
          },
        ],
      }
    }

    if (lowerMessage.includes("deal") || lowerMessage.includes("sale") || lowerMessage.includes("discount")) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Great timing! Here are our hottest deals with amazing discounts:",
        isUser: false,
        timestamp: new Date(),
        products: [
          {
            id: "3",
            name: "Gaming Mouse RGB",
            price: 29.99,
            originalPrice: 59.99,
            image: "/gaming-mouse.png",
            rating: 4.7,
            category: "Gaming",
          },
          {
            id: "4",
            name: "Wireless Earbuds",
            price: 49.99,
            originalPrice: 89.99,
            image: "/wireless-earbuds.png",
            rating: 4.5,
            category: "Audio",
          },
        ],
      }
    }

    if (lowerMessage.includes("electronics")) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Our electronics section has amazing products! Here are some top picks:",
        isUser: false,
        timestamp: new Date(),
        products: [
          {
            id: "1",
            name: "Wireless Headphones Pro",
            price: 79.99,
            originalPrice: 129.99,
            image: "/modern-wireless-headphones.jpg",
            rating: 4.8,
            category: "Electronics",
          },
        ],
      }
    }

    if (lowerMessage.includes("gift")) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Perfect! Here are some great gift ideas that everyone loves:",
        isUser: false,
        timestamp: new Date(),
        products: [
          {
            id: "2",
            name: "Smart Fitness Watch",
            price: 199.99,
            image: "/sleek-smartwatch.jpg",
            rating: 4.6,
            category: "Wearables",
          },
        ],
      }
    }

    // Default response
    return {
      id: (Date.now() + 1).toString(),
      content:
        "I'd be happy to help you with that! You can browse our categories like Electronics, Fashion, Home & Garden, or Sports & Fitness. Is there a specific product type you're interested in, or would you like me to show you our current deals?",
      isUser: false,
      timestamp: new Date(),
    }
  }

  const handleOpenAssistant = () => {
    setIsOpen(true)
    setShowTooltip(false)
    localStorage.setItem("ai-assistant-tooltip-seen", "true")
  }

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Onboarding Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-16 right-0 mb-2 w-64 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-primary/20 animate-in slide-in-from-bottom-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100">Meet your AI shopping assistant!</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Get personalized product recommendations and instant help.
                </p>
              </div>
            </div>
            <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white dark:bg-gray-900 border-r border-b border-primary/20 rotate-45"></div>
          </div>
        )}

        {/* Chat Icon Button */}
        <Button
          onClick={handleOpenAssistant}
          size="lg"
          className={cn(
            "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
            "bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90",
            "border-2 border-white/20 backdrop-blur-sm",
            showTooltip && "animate-pulse",
          )}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat Window */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full h-full sm:max-w-md md:max-w-lg lg:max-w-xl sm:max-h-[90vh] sm:w-full p-0 gap-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-primary/20 sm:rounded-lg rounded-none flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0 pb-3 bg-gradient-to-r from-primary/10 to-blue-500/10 sm:rounded-t-lg px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-base sm:text-lg truncate">AI Shopping Assistant</DialogTitle>
                  <p className="text-xs text-muted-foreground">Online • Ready to help</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 p-3 sm:p-4 md:p-6">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex gap-2", message.isUser ? "justify-end" : "justify-start")}>
                    {!message.isUser && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 text-sm break-words",
                        message.isUser
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                      )}
                    >
                      <p className="break-words">{message.content}</p>

                      {/* Product Recommendations */}
                      {message.products && (
                        <div className="mt-2 sm:mt-3 space-y-2">
                          {message.products.map((product) => (
                            <div
                              key={product.id}
                              className="bg-white dark:bg-gray-900 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex gap-2 sm:gap-3">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate text-xs sm:text-sm">
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold text-primary text-xs sm:text-sm">${product.price}</span>
                                    {product.originalPrice && (
                                      <span className="text-xs text-gray-500 line-through">
                                        ${product.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button size="sm" className="h-7 w-7 sm:h-8 sm:w-8 px-0 flex-shrink-0">
                                  <ShoppingCart className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.isUser && (
                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 sm:p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="flex-shrink-0 p-3 sm:p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  {quickQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-transparent justify-start text-left whitespace-normal"
                      onClick={() => handleSendMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 p-3 sm:p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  size="sm"
                  className="px-3 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
