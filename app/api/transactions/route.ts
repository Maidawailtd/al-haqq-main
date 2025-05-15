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

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

  // Build query
  let query = supabase
    .from("transactions")
    .select(`
      *,
      user_investments:investment_id (
        product_id,
        investment_products:product_id (name)
      )
    `)
    .eq("user_id", userId)

  if (type) {
    query = query.eq("type", type)
  }

  // Execute query
  const { data, error } = await query.order("created_at", { ascending: false }).limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ transactions: data })
}

export async function POST(request: NextRequest) {
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

    // Create transaction
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        ...body,
        user_id: userId,
        status: body.status || "pending",
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transaction: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
