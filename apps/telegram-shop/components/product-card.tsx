"use client"

import { Star, Plus } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/app/page"
import Link from "next/link"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge variant="secondary" className="absolute top-2 left-2">
              {product.category}
            </Badge>
          </div>
        </Link>

        <div className="p-4 space-y-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg text-balance hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground text-pretty">{product.description}</p>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">${product.price}</span>
        <Button onClick={() => onAddToCart(product)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
