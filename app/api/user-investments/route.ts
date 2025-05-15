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

  // Get user investments with product details
  const { data, error } = await supabase
    .from("user_investments")
    .select(`
      *,
      investment_products:product_id (
        name, type, description, min_investment, expected_return_min, expected_return_max, risk_level
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ investments: data })
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

    // Validate minimum investment amount
    const { data: product } = await supabase
      .from("investment_products")
      .select("min_investment")
      .eq("id", body.product_id)
      .single()

    if (product && body.amount < product.min_investment) {
      return NextResponse.json({ error: `Minimum investment amount is ${product.min_investment}` }, { status: 400 })
    }

    // Create investment
    const { data, error } = await supabase
      .from("user_investments")
      .insert({
        ...body,
        user_id: userId,
        status: "active",
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create transaction record
    await supabase.from("transactions").insert({
      user_id: userId,
      investment_id: data[0].id,
      type: "deposit",
      amount: body.amount,
      status: "completed",
      description: `Investment in ${body.product_name || "product"}`,
    })

    return NextResponse.json({ investment: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
