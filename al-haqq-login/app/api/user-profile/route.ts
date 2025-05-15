import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  // Get authenticated user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  // Get user data
  const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // Get profile data
  const { data: profileData, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (profileError && profileError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Combine user and profile data
  const profile = {
    ...userData,
    profile: profileData || null,
  }

  return NextResponse.json({ profile })
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  // Get authenticated user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const userId = session.user.id

    // Update user data
    if (body.user) {
      const { error: userError } = await supabase.from("users").update(body.user).eq("id", userId)

      if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 })
      }
    }

    // Update or insert profile data
    if (body.profile) {
      // Check if profile exists
      const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("user_id", userId).single()

      if (existingProfile) {
        // Update existing profile
        const { error: profileError } = await supabase.from("user_profiles").update(body.profile).eq("user_id", userId)

        if (profileError) {
          return NextResponse.json({ error: profileError.message }, { status: 500 })
        }
      } else {
        // Insert new profile
        const { error: profileError } = await supabase.from("user_profiles").insert({
          ...body.profile,
          user_id: userId,
        })

        if (profileError) {
          return NextResponse.json({ error: profileError.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
