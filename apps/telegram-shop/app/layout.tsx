import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { FloatingAIAssistant } from "@/components/floating-ai-assistant"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "TeleShop - Smart Shopping Experience",
  description: "Your AI-powered shopping companion for the best deals and products",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          {children}
          <FloatingAIAssistant />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
