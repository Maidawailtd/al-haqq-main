import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, BarChart3 } from "lucide-react"
import PortfolioChart from "@/components/dashboard/portfolio-chart"
import InvestmentPerformance from "@/components/dashboard/investment-performance"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  // Get user investments with product details
  const { data: investments } = await supabase
    .from("user_investments")
    .select(`
      *,
      investment_products:product_id (
        name, type, description, min_investment, expected_return_min, expected_return_max, risk_level
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  // Calculate total investment value
  const totalInvested = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0

  // Group investments by type
  const investmentsByType =
    investments?.reduce(
      (acc, inv) => {
        const type = inv.investment_products.type
        if (!acc[type]) {
          acc[type] = 0
        }
        acc[type] += inv.amount
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  // Get recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      user_investments:investment_id (
        product_id,
        investment_products:product_id (name)
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {userData?.full_name || "Investor"}</h1>
      <p className="text-gray-600 mb-8">Here's an overview of your investments and recent activities</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Investments</CardDescription>
            <CardTitle className="text-3xl">${totalInvested.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">{investments?.length || 0} active investments</div>
          </CardContent>
        </Card>

        {Object.entries(investmentsByType).map(([type, amount]) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardDescription>
                {type === "sukuk" ? "Sukuk Fund" : type === "equity" ? "Equity Fund" : "Real Estate Fund"}
              </CardDescription>
              <CardTitle className="text-3xl">${amount.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                {type === "sukuk" ? (
                  <ArrowUpRight className="h-4 w-4 mr-1 text-emerald-600" />
                ) : type === "equity" ? (
                  <TrendingUp className="h-4 w-4 mr-1 text-emerald-600" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-1 text-amber-600" />
                )}
                <span className={type === "real_estate" ? "text-amber-600" : "text-emerald-600"}>
                  {type === "sukuk" ? "+5.2%" : type === "equity" ? "+8.7%" : "+3.1%"} this year
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="portfolio">Portfolio Performance</TabsTrigger>
              <TabsTrigger value="products">Investment Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Value</CardTitle>
                  <CardDescription>Your investment growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <PortfolioChart investments={investments || []} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Performance</CardTitle>
                  <CardDescription>Performance of your investment products</CardDescription>
                </CardHeader>
                <CardContent>
                  <InvestmentPerformance investments={investments || []} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 bg-gray-100 p-2 rounded-full">
                          {transaction.type === "deposit" ? (
                            <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                          ) : transaction.type === "withdrawal" ? (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type === "deposit"
                              ? `Deposit to ${transaction.user_investments?.investment_products.name || "Investment"}`
                              : transaction.type === "withdrawal"
                                ? `Withdrawal from ${
                                    transaction.user_investments?.investment_products.name || "Investment"
                                  }`
                                : `Profit from ${
                                    transaction.user_investments?.investment_products.name || "Investment"
                                  }`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-medium ${
                          transaction.type === "deposit" || transaction.type === "profit_distribution"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No transactions found</div>
              )}
              <div className="mt-4 text-center">
                <Link href="/dashboard/transactions" className="text-emerald-700 hover:underline text-sm">
                  View all transactions
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Investment Opportunities</CardTitle>
            <CardDescription>Explore new investment options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Sukuk Income Fund</h3>
                  <p className="text-sm text-gray-600">Low risk, 5-7% expected return</p>
                </div>
                <Link
                  href="/investments/sukuk-income-fund"
                  className="text-emerald-700 hover:underline text-sm font-medium"
                >
                  Learn more
                </Link>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Ethical Equity Fund</h3>
                  <p className="text-sm text-gray-600">Medium risk, 8-12% expected return</p>
                </div>
                <Link
                  href="/investments/ethical-equity-fund"
                  className="text-emerald-700 hover:underline text-sm font-medium"
                >
                  Learn more
                </Link>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">GCC Real Estate Fund</h3>
                  <p className="text-sm text-gray-600">Medium-high risk, 9-13% expected return</p>
                </div>
                <Link
                  href="/investments/gcc-real-estate-fund"
                  className="text-emerald-700 hover:underline text-sm font-medium"
                >
                  Learn more
                </Link>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link href="/investments" className="text-emerald-700 hover:underline text-sm">
                View all investment options
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Profit Distributions</CardTitle>
            <CardDescription>Expected profit payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Sukuk Income Fund</h3>
                  <p className="text-sm text-gray-600">Quarterly distribution</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-700">$375.00</p>
                  <p className="text-xs text-gray-500">Expected on Jun 30, 2025</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Ethical Equity Fund</h3>
                  <p className="text-sm text-gray-600">Bi-annual distribution</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-700">$1,250.00</p>
                  <p className="text-xs text-gray-500">Expected on Jul 15, 2025</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">GCC Real Estate Fund</h3>
                  <p className="text-sm text-gray-600">Annual distribution</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-700">$2,250.00</p>
                  <p className="text-xs text-gray-500">Expected on Dec 15, 2025</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/distributions" className="text-emerald-700 hover:underline text-sm">
                View all distributions
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
