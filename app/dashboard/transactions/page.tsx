import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import { format } from "date-fns"

export default async function TransactionsPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get all transactions
  const { data: transactions, error } = await supabase
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

  if (error) {
    console.error("Error fetching transactions:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load transaction data. Please try again later.
        </div>
      </div>
    )
  }

  // Group transactions by type
  const deposits = transactions.filter((t) => t.type === "deposit")
  const withdrawals = transactions.filter((t) => t.type === "withdrawal")
  const profits = transactions.filter((t) => t.type === "profit_distribution")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
      <p className="text-gray-600 mb-8">View all your financial activities</p>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="profits">Profit Distributions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TransactionList transactions={transactions} />
        </TabsContent>

        <TabsContent value="deposits">
          <TransactionList transactions={deposits} />
        </TabsContent>

        <TabsContent value="withdrawals">
          <TransactionList transactions={withdrawals} />
        </TabsContent>

        <TabsContent value="profits">
          <TransactionList transactions={profits} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TransactionList({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No transactions found.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Your financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <div className="mr-4 bg-gray-100 p-3 rounded-full">
                  {transaction.type === "deposit" ? (
                    <ArrowDownRight className="h-5 w-5 text-emerald-600" />
                  ) : transaction.type === "withdrawal" ? (
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {transaction.type === "deposit"
                      ? `Deposit to ${transaction.user_investments?.investment_products.name || "Investment"}`
                      : transaction.type === "withdrawal"
                        ? `Withdrawal from ${transaction.user_investments?.investment_products.name || "Investment"}`
                        : `Profit from ${transaction.user_investments?.investment_products.name || "Investment"}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(transaction.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                  {transaction.description && (
                    <div className="text-sm text-gray-500 mt-1">{transaction.description}</div>
                  )}
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
      </CardContent>
    </Card>
  )
}
