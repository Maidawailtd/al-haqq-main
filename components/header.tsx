"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Logo from "./logo"
import { useAuth } from "@/contexts/auth-context"
import LogoutButton from "./auth/logout-button"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Investments", href: "/investments" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ]

  // Additional links for authenticated users
  const authNavLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Investments", href: "/dashboard/investments" },
    { name: "Profile", href: "/dashboard/profile" },
  ]

  // Determine which links to show based on authentication status
  const displayLinks = user ? [...navLinks, ...authNavLinks] : navLinks

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {displayLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-emerald-700 border-b-2 border-emerald-700"
                    : "text-gray-600 hover:text-emerald-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
                  <Link href="/dashboard/profile">
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {displayLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium py-2 ${isActive(link.href) ? "text-emerald-700" : "text-gray-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <Button asChild variant="outline" className="border-emerald-700 text-emerald-700 w-full">
                    <Link href="/dashboard/profile">
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </Link>
                  </Button>
                  <LogoutButton variant="default" className="bg-emerald-700 hover:bg-emerald-800 w-full" />
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="border-emerald-700 text-emerald-700 w-full">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild className="bg-emerald-700 hover:bg-emerald-800 w-full">
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
