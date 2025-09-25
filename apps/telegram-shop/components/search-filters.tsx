"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: SearchFiltersProps) {
  const categories = [
    { value: "All", label: "All", icon: "🛍️", color: "bg-primary/10 text-primary hover:bg-primary/20" },
    {
      value: "Electronics",
      label: "Electronics",
      icon: "📱",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      value: "Home",
      label: "Home",
      icon: "🏠",
      color: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      value: "Fitness",
      label: "Fitness",
      icon: "💪",
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
    },
    {
      value: "Fashion",
      label: "Fashion",
      icon: "👗",
      color: "bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "secondary"}
              className={`
                cursor-pointer transition-all duration-200 px-4 py-2 text-sm font-medium
                ${
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : category.color
                }
                hover:scale-105 hover:shadow-md
              `}
              onClick={() => onCategoryChange(category.value)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[200px] bg-background border-2 hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">📝 Name</SelectItem>
            <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
            <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
            <SelectItem value="rating">⭐ Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
