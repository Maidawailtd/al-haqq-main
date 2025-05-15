import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")
  const active = searchParams.get("active")

  // Build query
  let query = supabase.from("investment_products").select("*")

  if (type) {
    query = query.eq("type", type)
  }

  if (active !== null) {
    query = query.eq("is_active", active === "true")
  }

  // Execute query
  const { data, error } = await query.order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data })
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  // Verify admin role (implement proper authorization)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const { data, error } = await supabase.from("investment_products").insert(body).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
