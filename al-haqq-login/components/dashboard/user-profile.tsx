"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

export default function UserProfile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      setIsLoading(true)

      try {
        // Get user data from our custom users table
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error && error.code === "PGRST116") {
          // User not found in custom table, create it
          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            is_active: true,
            is_verified: true,
          })

          if (!insertError) {
            // Retry fetching
            const { data: newData } = await supabase.from("users").select("*").eq("id", user.id).single()
            if (newData) {
              setFormData({
                fullName: newData.full_name || "",
                email: user.email || "",
                phoneNumber: newData.phone_number || "",
              })
            }
          }
        } else if (error) {
          throw error
        }

        if (data) {
          setFormData({
            fullName: data.full_name || "",
            email: user.email || "",
            phoneNumber: data.phone_number || "",
          })
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Update user data in our custom users table
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      setSuccessMessage("Profile updated successfully")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

            {successMessage && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{successMessage}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled={true} // Email can't be changed directly
              />
              <p className="text-xs text-gray-500">Email cannot be changed directly. Contact support for assistance.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
