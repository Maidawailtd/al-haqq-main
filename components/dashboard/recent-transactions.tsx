"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions?limit=5")
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }

        const data = await response.json()
        setTransactions(data.transactions)
      } catch (err) {
        setError("Failed to load transaction data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No transactions found</div>
        ) : (
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
                          ? `Withdrawal from ${transaction.user_investments?.investment_products.name || "Investment"}`
                          : `Profit from ${transaction.user_investments?.investment_products.name || "Investment"}`}
                    </div>
                    <div className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</div>
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
        )}
        <div className="mt-4 text-center">
          <Link href="/dashboard/transactions" className="text-emerald-700 hover:underline text-sm">
            View all transactions
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
