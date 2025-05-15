"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { recordConsent } from "@/lib/consent"
import { useAuth } from "@/contexts/auth-context"

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem("cookie_consent")
    if (!hasConsent) {
      setShowConsent(true)
    }
  }, [])

  const acceptAll = async () => {
    localStorage.setItem("cookie_consent", "all")

    // Record consent if user is logged in
    if (user) {
      await recordConsent(user.id, "cookies", true)
    }

    setShowConsent(false)
  }

  const acceptEssential = async () => {
    localStorage.setItem("cookie_consent", "essential")

    // Record consent if user is logged in
    if (user) {
      await recordConsent(user.id, "cookies", false)
    }

    setShowConsent(false)
  }

  if (!showConsent) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-4">
          <h3 className="text-lg font-medium mb-1">Cookie Consent</h3>
          <p className="text-gray-600 text-sm">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By
            clicking "Accept All", you consent to our use of cookies. You can also choose to only accept essential
            cookies.
            <a href="/privacy" className="text-emerald-700 hover:underline ml-1">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={acceptEssential} className="text-sm">
            Essential Only
          </Button>
          <Button onClick={acceptAll} className="bg-emerald-700 hover:bg-emerald-800 text-sm">
            Accept All
          </Button>
        </div>
      </div>
    </div>
  )
}
