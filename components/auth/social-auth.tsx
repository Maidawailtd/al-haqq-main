"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"
import { GoogleIcon, FacebookIcon, AppleIcon } from "@/app/components/icons"

type Provider = "google" | "facebook" | "apple"

export function SocialAuth() {
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setIsLoading] = useState<Provider | null>(null)

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setIsLoading(provider)

      // Record the redirect URL to return to after authentication
      const redirectTo = `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error signing in with social provider:", error)
      alert("Error signing in with social provider. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        type="button"
        disabled={isLoading !== null}
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin("google")}
      >
        <GoogleIcon className="h-5 w-5" />
        {isLoading === "google" ? "Signing in..." : "Continue with Google"}
      </Button>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading !== null}
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin("facebook")}
      >
        <FacebookIcon className="h-5 w-5" />
        {isLoading === "facebook" ? "Signing in..." : "Continue with Facebook"}
      </Button>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading !== null}
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin("apple")}
      >
        <AppleIcon className="h-5 w-5" />
        {isLoading === "apple" ? "Signing in..." : "Continue with Apple"}
      </Button>
    </div>
  )
}
