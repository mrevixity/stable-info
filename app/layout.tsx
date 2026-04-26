import { Geist_Mono, Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Stable SMP Info Server",
  description:
    "stablesmp info is a place where user can chat see competitive market prices and see all info on the server",
  openGraph: {
    title: "Stable SMP Info Server",
    description:
      "stablesmp info is a place where user can chat see competitive market prices and see all info on the server",
    type: "website",
    images: ["/logo.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stable SMP Info Server",
    description:
      "stablesmp info is a place where user can chat see competitive market prices and see all info on the server",
    images: ["/logo.webp"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
