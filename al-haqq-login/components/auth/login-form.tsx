"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  const { signIn } = useAuth()

  // Check for verification success message
  const verificationSuccess = searchParams.get("verified") === "true"

  useEffect(() => {
    // Check if account is locked
    const lockedUntil = localStorage.getItem("account_lockout")
    if (lockedUntil) {
      const lockoutTimestamp = Number.parseInt(lockedUntil)
      if (lockoutTimestamp > Date.now()) {
        setIsLocked(true)
        setLockoutTime(Math.ceil((lockoutTimestamp - Date.now()) / 1000))

        // Set up countdown timer
        const timer = setInterval(() => {
          setLockoutTime((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(timer)
              setIsLocked(false)
              localStorage.removeItem("account_lockout")
              return null
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } else {
        // Lockout period expired
        localStorage.removeItem("account_lockout")
      }
    }

    // Get previous login attempts
    const attempts = localStorage.getItem("login_attempts")
    if (attempts) {
      setLoginAttempts(Number.parseInt(attempts))
    }
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        // Increment login attempts
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        localStorage.setItem("login_attempts", newAttempts.toString())

        // Check if account should be locked
        if (newAttempts >= 5) {
          const lockoutDuration = 5 * 60 * 1000 // 5 minutes
          const lockoutUntil = Date.now() + lockoutDuration
          localStorage.setItem("account_lockout", lockoutUntil.toString())
          setIsLocked(true)
          setLockoutTime(300) // 5 minutes in seconds
          setError("Too many failed login attempts. Account locked for 5 minutes.")
        } else {
          setError(error.message)
        }
      } else {
        // Reset login attempts on successful login
        setLoginAttempts(0)
        localStorage.removeItem("login_attempts")
        localStorage.removeItem("account_lockout")

        // Redirect to the intended page or dashboard
        router.push(redirectTo)
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
        <CardTitle className="text-2xl font-bold text-center">Login to Your Account</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your investment dashboard
        </CardDescription>
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

            {verificationSuccess && (
              <Alert variant="success" className="bg-green-50 text-green-600 border-green-200">
                <AlertDescription>Your email has been verified successfully. You can now log in.</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert variant="success" className="bg-green-50 text-green-600 border-green-200">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {isLocked && lockoutTime && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Account temporarily locked due to too many failed attempts. Try again in{" "}
                  {Math.floor(lockoutTime / 60)}:{(lockoutTime % 60).toString().padStart(2, "0")}.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isLocked}
                aria-describedby="email-description"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-emerald-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isLocked}
                  aria-describedby="password-description"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLocked}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800"
              disabled={isLoading || isLocked}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-emerald-700 hover:underline">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
