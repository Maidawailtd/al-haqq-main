"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  userData: any
  profileData: any
}

export default function ProfileForm({ userData, profileData }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    user: {
      full_name: userData?.full_name || "",
      email: userData?.email || "",
      phone_number: userData?.phone_number || "",
    },
    profile: {
      date_of_birth: profileData?.date_of_birth || "",
      nationality: profileData?.nationality || "",
      address: profileData?.address || "",
      city: profileData?.city || "",
      country: profileData?.country || "",
      postal_code: profileData?.postal_code || "",
      occupation: profileData?.occupation || "",
      income_range: profileData?.income_range || "",
      risk_tolerance: profileData?.risk_tolerance || "medium",
      investment_goals: profileData?.investment_goals || "",
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof typeof formData],
          [field]: value,
        },
      })
    }
  }

  const handleSelectChange = (value: string, name: string) => {
    const [section, field] = name.split(".")
    setFormData({
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError(null)

    try {
      const response = await fetch("/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">Profile updated successfully!</div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="user.full_name">Full Name</Label>
            <Input
              id="user.full_name"
              name="user.full_name"
              value={formData.user.full_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user.email">Email</Label>
            <Input
              id="user.email"
              name="user.email"
              type="email"
              value={formData.user.email}
              onChange={handleChange}
              disabled={true} // Email should not be editable
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="user.phone_number">Phone Number</Label>
            <Input
              id="user.phone_number"
              name="user.phone_number"
              value={formData.user.phone_number}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile.date_of_birth">Date of Birth</Label>
            <Input
              id="profile.date_of_birth"
              name="profile.date_of_birth"
              type="date"
              value={formData.profile.date_of_birth}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Address Information</h3>
        <div className="space-y-2">
          <Label htmlFor="profile.address">Address</Label>
          <Textarea
            id="profile.address"
            name="profile.address"
            value={formData.profile.address}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profile.city">City</Label>
            <Input
              id="profile.city"
              name="profile.city"
              value={formData.profile.city}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile.country">Country</Label>
            <Input
              id="profile.country"
              name="profile.country"
              value={formData.profile.country}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile.postal_code">Postal Code</Label>
            <Input
              id="profile.postal_code"
              name="profile.postal_code"
              value={formData.profile.postal_code}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Investment Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profile.occupation">Occupation</Label>
            <Input
              id="profile.occupation"
              name="profile.occupation"
              value={formData.profile.occupation}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile.income_range">Income Range</Label>
            <Select
              value={formData.profile.income_range}
              onValueChange={(value) => handleSelectChange(value, "profile.income_range")}
              disabled={isSubmitting}
            >
              <SelectTrigger id="profile.income_range">
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under $50,000">Under $50,000</SelectItem>
                <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                <SelectItem value="$100,000 - $250,000">$100,000 - $250,000</SelectItem>
                <SelectItem value="$250,000 - $500,000">$250,000 - $500,000</SelectItem>
                <SelectItem value="Over $500,000">Over $500,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profile.risk_tolerance">Risk Tolerance</Label>
            <Select
              value={formData.profile.risk_tolerance}
              onValueChange={(value) => handleSelectChange(value, "profile.risk_tolerance")}
              disabled={isSubmitting}
            >
              <SelectTrigger id="profile.risk_tolerance">
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Prefer stable returns with minimal risk</SelectItem>
                <SelectItem value="medium">Medium - Balance between growth and stability</SelectItem>
                <SelectItem value="high">High - Willing to accept volatility for higher returns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile.investment_goals">Investment Goals</Label>
            <Textarea
              id="profile.investment_goals"
              name="profile.investment_goals"
              value={formData.profile.investment_goals}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Retirement planning, wealth growth, regular income"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
