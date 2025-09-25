"use client"

import { X, Minus, Plus, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { CartItem } from "@/app/page"

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  total: number
}

export function ShoppingCart({ isOpen, onClose, items, onUpdateQuantity, total }: ShoppingCartProps) {
  const savings = items.reduce((acc, item) => {
    const originalPrice = item.price * 1.2 // Simulate 20% discount
    return acc + (originalPrice - item.price) * item.quantity
  }, 0)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-b from-background to-primary/5">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <p className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            {items.length > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                ${savings.toFixed(2)} saved
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pb-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="p-6 bg-primary/5 rounded-full mb-6">
                  <ShoppingBag className="w-12 h-12 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Discover amazing products and add them to your cart to get started
                </p>
                <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative bg-white dark:bg-gray-900/50 rounded-2xl p-4 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/2 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative flex gap-4">
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border border-primary/10"
                        />
                        {index === 0 && (
                          <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1">
                            Popular
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-base leading-tight">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">4.8</span>
                              </div>
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                Free Shipping
                              </Badge>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, 0)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">${item.price}</span>
                              <span className="text-sm text-muted-foreground line-through">
                                ${(item.price * 1.2).toFixed(2)}
                              </span>
                            </div>
                            <span className="text-xs text-green-600 font-medium">
                              Save ${(item.price * 1.2 - item.price).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 bg-primary/5 rounded-full p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <div className="min-w-[2rem] text-center">
                              <span className="font-semibold text-sm">{item.quantity}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-primary/10 space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">You Save:</span>
                  <span className="font-medium text-green-600">-${savings.toFixed(2)}</span>
                </div>
                <div className="border-t border-primary/10 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                    onClick={onClose}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 bg-transparent"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
