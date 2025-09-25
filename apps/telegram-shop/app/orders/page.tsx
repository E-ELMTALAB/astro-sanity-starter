"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShopHeader } from "@/components/shop-header"
import { ShoppingCart } from "@/components/shopping-cart"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 299.99,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 199.99, image: "/modern-wireless-headphones.jpg" },
      { name: "Phone Case", quantity: 2, price: 50.0, image: "/colorful-phone-case-display.png" },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 149.99,
    items: [{ name: "Smart Watch", quantity: 1, price: 149.99, image: "/sleek-smartwatch.jpg" }],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "processing",
    total: 89.99,
    items: [{ name: "Wireless Mouse", quantity: 1, price: 89.99, image: "/gaming-mouse.png" }],
  },
]

const statusConfig = {
  processing: { icon: Clock, color: "bg-yellow-500", text: "Processing" },
  shipped: { icon: Truck, color: "bg-blue-500", text: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-green-500", text: "Delivered" },
}

export default function OrdersPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <Badge variant="secondary" className="text-sm">
              {mockOrders.length} orders
            </Badge>
          </div>

          <div className="grid gap-6">
            {mockOrders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
              const statusColor = statusConfig[order.status as keyof typeof statusConfig].color
              const statusText = statusConfig[order.status as keyof typeof statusConfig].text

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Ordered on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{statusText}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${order.total}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <Link href={`/order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Package className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === "delivered" && (
                        <Button variant="ghost" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />
    </div>
  )
}
