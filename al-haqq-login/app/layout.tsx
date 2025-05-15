import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import CookieConsent from "@/components/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Al Haqq Investment - Islamic Investment Platform",
  description: "Shariah-compliant investment opportunities for ethical investors",
  keywords: "islamic finance, halal investments, sukuk, ethical investing, shariah compliant",
  authors: [{ name: "Al Haqq Investment" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Al Haqq Investment - Islamic Investment Platform",
    description: "Shariah-compliant investment opportunities for ethical investors",
    url: "https://alhaqq-investment.com",
    siteName: "Al Haqq Investment",
    locale: "en_US",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
