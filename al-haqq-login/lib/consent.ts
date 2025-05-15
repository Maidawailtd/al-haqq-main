import { getSupabaseBrowserClient } from "./supabase/client"

export async function recordConsent(userId: string, consentType: string, consentGiven: boolean) {
  try {
    const supabase = getSupabaseBrowserClient()

    // Get IP address
    const ipResponse = await fetch("https://api.ipify.org?format=json")
    const ipData = await ipResponse.json()

    await supabase.from("consent_logs").insert({
      user_id: userId,
      consent_type: consentType,
      consent_given: consentGiven,
      ip_address: ipData.ip,
      user_agent: navigator.userAgent,
    })

    return { success: true }
  } catch (error) {
    console.error("Error recording consent:", error)
    return { success: false, error }
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<{
    email_notifications: boolean
    sms_notifications: boolean
    marketing_communications: boolean
    language: string
    theme: string
  }>,
) {
  try {
    const supabase = getSupabaseBrowserClient()

    // Check if preferences exist
    const { data: existingPrefs } = await supabase
      .from("user_preferences")
      .select("user_id")
      .eq("user_id", userId)
      .single()

    if (existingPrefs) {
      // Update existing preferences
      await supabase
        .from("user_preferences")
        .update({
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
    } else {
      // Insert new preferences
      await supabase.from("user_preferences").insert({
        user_id: userId,
        ...preferences,
      })
    }

    // Record consent if marketing preference is changed
    if (preferences.marketing_communications !== undefined) {
      await recordConsent(userId, "marketing", preferences.marketing_communications)
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return { success: false, error }
  }
}
