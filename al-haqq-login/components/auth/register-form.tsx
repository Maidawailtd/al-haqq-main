"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { recordConsent } from "@/lib/consent"
import { recordAuditLog } from "@/lib/audit"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    marketingConsent: false,
    dataProcessingConsent: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeTerms) {
      setError("You must agree to the terms of service and privacy policy")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }

        // Create user preferences
        const { error: prefsError } = await supabase.from("user_preferences").insert({
          user_id: data.user.id,
          marketing_communications: formData.marketingConsent,
        })

        if (prefsError) {
          console.error("Error creating preferences:", prefsError)
        }

        // Record consents
        await recordConsent(data.user.id, "terms", formData.agreeTerms)
        await recordConsent(data.user.id, "marketing", formData.marketingConsent)
        await recordConsent(data.user.id, "data_processing", formData.dataProcessingConsent)

        // Record audit log
        await recordAuditLog({
          userId: data.user.id,
          action: "REGISTER",
          entity: "user",
          entityId: data.user.id,
          details: { email: formData.email },
        })

        setSuccessMessage("Registration successful! Please check your email to verify your account.")

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/register/success")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">Enter your details to create your investment account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert variant="success" className="bg-green-50 text-green-600 border-green-200">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="dataProcessingConsent"
                name="dataProcessingConsent"
                checked={formData.dataProcessingConsent}
                onCheckedChange={(checked) => setFormData({ ...formData, dataProcessingConsent: checked as boolean })}
                disabled={isLoading}
              />
              <label
                htmlFor="dataProcessingConsent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I consent to the processing of my personal data as described in the{" "}
                <Link href="/privacy" className="text-emerald-700 hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                disabled={isLoading}
                required
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-emerald-700 hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emerald-700 hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketingConsent"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onCheckedChange={(checked) => setFormData({ ...formData, marketingConsent: checked as boolean })}
                disabled={isLoading}
              />
              <label
                htmlFor="marketingConsent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I would like to receive marketing communications about products and services
              </label>
            </div>

            <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-700 hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
