import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import InvestmentPerformanceChart from "@/components/investments/investment-performance-chart"

export default async function InvestmentDetailPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()

  // Fetch product details
  const { data: product, error } = await supabase.from("investment_products").select("*").eq("id", params.id).single()

  if (error || !product) {
    notFound()
  }

  // Format product details
  const formatRiskLevel = (level: string) => {
    switch (level) {
      case "low":
        return "Low"
      case "medium":
        return "Medium"
      case "high":
        return "Medium-High"
      default:
        return level
    }
  }

  const formatDistributionFrequency = (freq?: string) => {
    if (!freq) return "N/A"

    switch (freq) {
      case "monthly":
        return "Monthly"
      case "quarterly":
        return "Quarterly"
      case "bi-annual":
        return "Bi-annual"
      case "annual":
        return "Annual"
      default:
        return freq
    }
  }

  const formatDuration = (months?: number) => {
    if (!months) return "Flexible"

    if (months >= 12) {
      const years = Math.floor(months / 12)
      return `${years} Year${years > 1 ? "s" : ""}`
    }

    return `${months} Months`
  }

  // Generate key benefits based on product type
  const keyBenefits =
    product.type === "sukuk"
      ? [
          "Stable income through regular profit distributions",
          "Lower volatility compared to equity investments",
          "Diversification across multiple issuers and sectors",
        ]
      : product.type === "equity"
        ? [
            "Higher potential returns compared to fixed income",
            "Global diversification across multiple markets",
            "Strict ethical screening process",
          ]
        : [
            "Potential for capital appreciation and rental income",
            "Hedge against inflation through real asset ownership",
            "Professional property management and maintenance",
          ]

  // Generate FAQs based on product type
  const faqs = [
    {
      question: "What makes this investment Shariah-compliant?",
      answer:
        "All our investments undergo rigorous screening by our Shariah board to ensure they comply with Islamic principles. This includes avoiding investments in prohibited industries, ensuring there is no excessive uncertainty (gharar) in contracts, and avoiding interest-based (riba) transactions.",
    },
    {
      question: "How often will I receive returns on my investment?",
      answer: `The ${product.name} distributes profits ${formatDistributionFrequency(product.profit_distribution_frequency).toLowerCase()}. All distributions are automatically credited to your account, and you can choose to reinvest or withdraw them.`,
    },
    {
      question: "Can I withdraw my investment before the minimum period?",
      answer:
        "Early withdrawals are possible but may be subject to fees depending on the investment type and how long you've been invested. Please contact our customer service for specific details related to your investment.",
    },
  ]

  // Fetch performance data
  const { data: performanceData } = await supabase
    .from("investment_performance")
    .select("*")
    .eq("product_id", product.id)
    .order("date", { ascending: true })
    .limit(30)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-16 px-4 rounded-lg mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{product.name}</h1>
          <p className="text-xl">
            {product.description ||
              `A Shariah-compliant ${product.type.replace("_", " ")} investment opportunity with competitive returns.`}
          </p>
        </div>
      </section>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-600 mb-6">
            {product.description ||
              `Our ${product.name} provides investors with a Shariah-compliant opportunity to invest in ${
                product.type === "sukuk"
                  ? "Islamic bonds issued by sovereign entities, financial institutions, and corporations"
                  : product.type === "equity"
                    ? "a diversified portfolio of Shariah-compliant stocks across various sectors and regions"
                    : "Shariah-compliant commercial properties in prime locations"
              }.`}
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-2">Key Benefits</h3>
            <ul className="space-y-2">
              {keyBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
            <Link href="/dashboard/invest">Invest Now</Link>
          </Button>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{product.name} Details</CardTitle>
              <CardDescription>
                {product.type === "sukuk"
                  ? "Fixed income Shariah-compliant investment certificates"
                  : product.type === "equity"
                    ? "Diversified portfolio of Shariah-compliant stocks"
                    : "Investment in Shariah-compliant commercial properties"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-500">Minimum Investment</p>
                    <p className="text-xl font-semibold">${product.min_investment.toLocaleString()}</p>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-500">Expected Annual Return</p>
                    <p className="text-xl font-semibold">
                      {product.expected_return_min}-{product.expected_return_max}%
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-500">Risk Profile</p>
                    <p className="text-xl font-semibold">{formatRiskLevel(product.risk_level)}</p>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-500">Profit Distribution</p>
                    <p className="text-xl font-semibold">
                      {formatDistributionFrequency(product.profit_distribution_frequency)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-500">Minimum Period</p>
                    <p className="text-xl font-semibold">{formatDuration(product.duration_months)}</p>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-500">Additional Benefits</p>
                    <p className="text-xl font-semibold">
                      {product.type === "sukuk"
                        ? "No Early Withdrawal Fees"
                        : product.type === "equity"
                          ? "Market Reports"
                          : "Quarterly Updates"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Historical Performance</h2>
        <Card>
          <CardContent className="pt-6">
            <InvestmentPerformanceChart productId={product.id} performanceData={performanceData || []} />
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{faq.question}</CardTitle>
                <HelpCircle className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-900 text-white py-12 px-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
        <p className="text-xl mb-6 max-w-3xl mx-auto">
          Join thousands of investors who have chosen Al Haqq for their Shariah-compliant investment needs.
        </p>
        <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-gray-100">
          <Link href="/dashboard/invest" className="flex items-center gap-2">
            Start Investing <ArrowRight size={18} />
          </Link>
        </Button>
      </div>
    </div>
  )
}
