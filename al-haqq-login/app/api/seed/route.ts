import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // This should only be accessible in development or with admin privileges
  const supabase = getSupabaseServerClient()

  // Sample investment products
  const products = [
    {
      name: "Sukuk Fund",
      type: "sukuk",
      description: "Fixed income Shariah-compliant investment certificates",
      min_investment: 5000,
      expected_return_min: 5,
      expected_return_max: 7,
      risk_level: "low",
      duration_months: 12,
      profit_distribution_frequency: "quarterly",
      is_active: true,
    },
    {
      name: "Ethical Equity Fund",
      type: "equity",
      description: "Diversified portfolio of Shariah-compliant stocks",
      min_investment: 10000,
      expected_return_min: 8,
      expected_return_max: 12,
      risk_level: "medium",
      duration_months: 36,
      profit_distribution_frequency: "bi-annual",
      is_active: true,
    },
    {
      name: "Real Estate Fund",
      type: "real_estate",
      description: "Investment in Shariah-compliant commercial properties",
      min_investment: 25000,
      expected_return_min: 10,
      expected_return_max: 15,
      risk_level: "high",
      duration_months: 60,
      profit_distribution_frequency: "annual",
      is_active: true,
    },
  ]

  // Insert products
  const { data: insertedProducts, error: productsError } = await supabase
    .from("investment_products")
    .upsert(products, { onConflict: "name" })
    .select()

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 })
  }

  // Sample FAQ categories
  const faqCategories = [
    {
      name: "General",
      description: "General questions about Al Haqq Investment",
    },
    {
      name: "Investments",
      description: "Questions about our investment products",
    },
    {
      name: "Account",
      description: "Questions about your account and profile",
    },
  ]

  // Insert FAQ categories
  const { data: insertedCategories, error: categoriesError } = await supabase
    .from("faq_categories")
    .upsert(faqCategories, { onConflict: "name" })
    .select()

  if (categoriesError) {
    return NextResponse.json({ error: categoriesError.message }, { status: 500 })
  }

  // Sample FAQs
  const faqs = [
    {
      category_id: insertedCategories?.[0]?.id,
      question: "What is Al Haqq Investment?",
      answer:
        "Al Haqq Investment is a Shariah-compliant investment platform that provides ethical investment opportunities with competitive returns.",
      is_published: true,
      order_index: 1,
    },
    {
      category_id: insertedCategories?.[1]?.id,
      question: "What makes your investments Shariah-compliant?",
      answer:
        "All our investments undergo rigorous screening by our Shariah board to ensure they comply with Islamic principles. This includes avoiding investments in prohibited industries, ensuring there is no excessive uncertainty (gharar) in contracts, and avoiding interest-based (riba) transactions.",
      is_published: true,
      order_index: 1,
    },
    {
      category_id: insertedCategories?.[2]?.id,
      question: "How do I update my profile information?",
      answer:
        "You can update your profile information by logging into your account and navigating to the Profile section in your dashboard.",
      is_published: true,
      order_index: 1,
    },
  ]

  // Insert FAQs
  const { error: faqsError } = await supabase.from("faqs").upsert(faqs, { onConflict: "question" })

  if (faqsError) {
    return NextResponse.json({ error: faqsError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: "Database seeded successfully",
    products: insertedProducts,
    categories: insertedCategories,
  })
}
