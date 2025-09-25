"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShopHeader } from "@/components/shop-header"
import { ShoppingCart } from "@/components/shopping-cart"
import { ArrowLeft, Truck, CheckCircle, Clock, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock order data - in real app this would be fetched based on the ID
const mockOrderDetails = {
  id: "ORD-2024-001",
  date: "2024-01-15",
  status: "delivered",
  deliveryDate: "2024-01-18",
  total: 299.99,
  subtotal: 249.99,
  shipping: 15.0,
  tax: 35.0,
  items: [
    {
      name: "Wireless Headphones",
      quantity: 1,
      price: 199.99,
      image: "/modern-wireless-headphones.jpg",
      description: "Premium noise-cancelling wireless headphones",
    },
    {
      name: "Phone Case",
      quantity: 2,
      price: 25.0,
      image: "/colorful-phone-case-display.png",
      description: "Protective silicone phone case",
    },
  ],
  shippingAddress: {
    name: "John Doe",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
  },
  paymentMethod: {
    type: "Credit Card",
    last4: "4242",
    brand: "Visa",
  },
  tracking: {
    number: "1Z999AA1234567890",
    carrier: "UPS",
    updates: [
      { date: "2024-01-18", status: "Delivered", location: "New York, NY" },
      { date: "2024-01-17", status: "Out for delivery", location: "New York, NY" },
      { date: "2024-01-16", status: "In transit", location: "Newark, NJ" },
      { date: "2024-01-15", status: "Order shipped", location: "Warehouse" },
    ],
  },
}

const statusConfig = {
  processing: { icon: Clock, color: "bg-yellow-500", text: "Processing" },
  shipped: { icon: Truck, color: "bg-blue-500", text: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-green-500", text: "Delivered" },
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const order = mockOrderDetails
  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
  const statusColor = statusConfig[order.status as keyof typeof statusConfig].color
  const statusText = statusConfig[order.status as keyof typeof statusConfig].text

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{order.id}</CardTitle>
                      <p className="text-muted-foreground">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-medium">{statusText}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {order.status === "delivered" && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">
                          Delivered on {new Date(order.deliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tracking Information */}
              {order.status !== "processing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tracking Information</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {order.tracking.carrier} Tracking: {order.tracking.number}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.tracking.updates.map((update, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-2 ${index === 0 ? "bg-primary" : "bg-muted"}`} />
                          <div className="flex-1">
                            <p className="font-medium">{update.status}</p>
                            <p className="text-sm text-muted-foreground">{update.location}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(update.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-6 bg-primary rounded flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">
                        {order.paymentMethod.brand.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm">•••• •••• •••• {order.paymentMethod.last4}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
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
