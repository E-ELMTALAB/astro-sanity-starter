"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { X, Send, Bot, User, ShoppingBag, Star, Sparkles } from "lucide-react"
import type { Product } from "@/app/page"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  suggestedProducts?: Product[]
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onAddToCart: (product: Product) => void
}

export function AIAssistant({ isOpen, onClose, products, onAddToCart }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your AI shopping assistant. I can help you find the perfect products, answer questions about our items, and provide personalized recommendations. What are you looking for today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = [
    "Show me electronics under $100",
    "What are your best-selling products?",
    "I need a gift for someone",
    "What's on sale today?",
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
    setIsTyping(true)

    // Simulate AI response with product recommendations
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, products)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string, availableProducts: Product[]): Message => {
    const lowerMessage = userMessage.toLowerCase()
    let response = ""
    let suggestedProducts: Product[] = []

    if (lowerMessage.includes("electronics") || lowerMessage.includes("tech")) {
      const electronicsProducts = availableProducts.filter((p) => p.category === "Electronics")
      suggestedProducts = electronicsProducts.slice(0, 3)
      response =
        "I found some great electronics for you! Here are my top recommendations based on customer reviews and popularity:"
    } else if (lowerMessage.includes("under") && lowerMessage.includes("100")) {
      suggestedProducts = availableProducts.filter((p) => p.price < 100).slice(0, 3)
      response = "Here are some excellent products under $100 that I think you'll love:"
    } else if (lowerMessage.includes("best") || lowerMessage.includes("popular")) {
      suggestedProducts = availableProducts.sort((a, b) => b.rating - a.rating).slice(0, 3)
      response = "These are our best-selling and highest-rated products that customers absolutely love:"
    } else if (lowerMessage.includes("gift")) {
      suggestedProducts = availableProducts.slice(0, 3)
      response = "Perfect! I have some wonderful gift ideas that are popular with our customers:"
    } else if (lowerMessage.includes("sale") || lowerMessage.includes("discount")) {
      response =
        "Great timing! We have amazing deals running right now. Check out our Flash Sale section on the homepage for up to 50% off on selected items!"
    } else {
      suggestedProducts = availableProducts.slice(0, 2)
      response =
        "I'd be happy to help you find what you're looking for! Here are some popular products you might be interested in:"
    }

    return {
      id: Date.now().toString(),
      content: response,
      isUser: false,
      timestamp: new Date(),
      suggestedProducts,
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-left">AI Shopping Assistant</SheetTitle>
                <SheetDescription className="text-left">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Online now
                  </div>
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}>
                  {!message.isUser && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {message.suggestedProducts && message.suggestedProducts.length > 0 && (
                  <div className="ml-11 space-y-2">
                    {message.suggestedProducts.map((product) => (
                      <div key={product.id} className="bg-card border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="flex gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-primary">${product.price}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs bg-transparent"
                                onClick={() => onAddToCart(product)}
                              >
                                <ShoppingBag className="w-3 h-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-transparent"
                onClick={() => handleSendMessage(question)}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {question}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about our products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              className="flex-1"
            />
            <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim() || isTyping} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
