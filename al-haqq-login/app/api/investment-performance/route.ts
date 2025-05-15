import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient()

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get("productId")
  const range = searchParams.get("range") || "1m" // 1m, 3m, 6m, 1y

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  // Calculate date range
  const today = new Date()
  const startDate = new Date()

  switch (range) {
    case "1m":
      startDate.setMonth(today.getMonth() - 1)
      break
    case "3m":
      startDate.setMonth(today.getMonth() - 3)
      break
    case "6m":
      startDate.setMonth(today.getMonth() - 6)
      break
    case "1y":
      startDate.setFullYear(today.getFullYear() - 1)
      break
    default:
      startDate.setMonth(today.getMonth() - 1)
  }

  // Format dates for query
  const startDateStr = startDate.toISOString().split("T")[0]
  const endDateStr = today.toISOString().split("T")[0]

  // Get performance data
  const { data, error } = await supabase
    .from("investment_performance")
    .select("*")
    .eq("product_id", productId)
    .gte("date", startDateStr)
    .lte("date", endDateStr)
    .order("date")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get investment details
  const { data: product, error: productError } = await supabase
    .from("investment_products")
    .select("*")
    .eq("id", productId)
    .single()

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 })
  }

  // Calculate investment value over time
  const performance = data.map((item) => ({
    date: item.date,
    unit_price: item.unit_price,
    change_percentage: item.change_percentage,
    value: item.unit_price * 100, // Assuming 100 units for simplicity
  }))

  return NextResponse.json({
    product,
    performance,
  })
}
