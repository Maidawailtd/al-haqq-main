import { getSupabaseBrowserClient } from "./supabase/client"
import { getSupabaseServerClient } from "./supabase/server"

export async function recordAuditLog(params: {
  userId?: string
  action: string
  entity: string
  entityId?: string
  details?: Record<string, any>
  isServer?: boolean
}) {
  try {
    const { userId, action, entity, entityId, details, isServer } = params

    if (isServer) {
      const supabase = getSupabaseServerClient()
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action,
        entity,
        entity_id: entityId,
        details,
      })
    } else {
      const supabase = getSupabaseBrowserClient()

      // Get IP address for client-side
      const ipResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipResponse.json()

      await supabase.from("audit_logs").insert({
        user_id: userId,
        action,
        entity,
        entity_id: entityId,
        details,
        ip_address: ipData.ip,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error recording audit log:", error)
    return { success: false, error }
  }
}
