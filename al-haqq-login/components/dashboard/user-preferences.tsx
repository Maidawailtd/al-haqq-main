"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { updateUserPreferences } from "@/lib/consent"
import type { UserPreference } from "@/types/database"

type UserPreferencesProps = {
  userId: string
}

export default function UserPreferences({ userId }: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<UserPreference | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error
          throw error
        }

        if (data) {
          setPreferences(data as UserPreference)
        } else {
          // Set defaults if no preferences exist
          setPreferences({
            user_id: userId,
            email_notifications: true,
            sms_notifications: false,
            marketing_communications: false,
            language: "en",
            theme: "light",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Error fetching preferences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPreferences()
  }, [userId, supabase])

  const handleToggleChange = (field: keyof UserPreference, value: boolean) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [field]: value,
      })
    }
  }

  const handleSelectChange = (field: keyof UserPreference, value: string) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [field]: value,
      })
    }
  }

  const handleSave = async () => {
    if (!preferences) return

    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { success, error } = await updateUserPreferences(userId, {
        email_notifications: preferences.email_notifications,
        sms_notifications: preferences.sms_notifications,
        marketing_communications: preferences.marketing_communications,
        language: preferences.language,
        theme: preferences.theme,
      })

      if (!success) {
        throw new Error(error?.message || "Failed to save preferences")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your notification and display preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Your preferences have been saved successfully.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-500">Receive updates about your investments via email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={preferences?.email_notifications || false}
              onCheckedChange={(checked) => handleToggleChange("email_notifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smsNotifications" className="font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
            </div>
            <Switch
              id="smsNotifications"
              checked={preferences?.sms_notifications || false}
              onCheckedChange={(checked) => handleToggleChange("sms_notifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketingCommunications" className="font-medium">
                Marketing Communications
              </Label>
              <p className="text-sm text-gray-500">Receive updates about new products and services</p>
            </div>
            <Switch
              id="marketingCommunications"
              checked={preferences?.marketing_communications || false}
              onCheckedChange={(checked) => handleToggleChange("marketing_communications", checked)}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Display</h3>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={preferences?.language || "en"}
              onValueChange={(value) => handleSelectChange("language", value)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={preferences?.theme || "light"} onValueChange={(value) => handleSelectChange("theme", value)}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-700 hover:bg-emerald-800">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
