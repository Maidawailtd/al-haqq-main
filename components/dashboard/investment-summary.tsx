"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserInvestment, InvestmentProduct } from "@/types/database"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"

type InvestmentWithProduct = UserInvestment & {
  investment_products: InvestmentProduct
}

export default function InvestmentSummary() {
  const [investments, setInvestments] = useState<InvestmentWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch("/api/user-investments")

        if (!response.ok) {
          throw new Error("Failed to fetch investments")
        }

        const data = await response.json()
        setInvestments(data.investments)
      } catch (err) {
        setError("Failed to load investment data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestments()
  }, [])

  // Calculate total investment value
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)

  // Group investments by type
  const investmentsByType = investments.reduce(
    (acc, inv) => {
      const type = inv.investment_products.type
      if (!acc[type]) {
        acc[type] = 0
      }
      acc[type] += inv.amount
      return acc
    },
    {} as Record<string, number>,
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Investments</CardDescription>
          <CardTitle className="text-3xl">${totalInvested.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">{investments.length} active investments</div>
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
                <TrendingUp className="h-4 w-4 mr-1 text-emerald-600" />
              ) : type === "equity" ? (
                <TrendingUp className="h-4 w-4 mr-1 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-amber-600" />
              )}
              <span className={type === "real_estate" ? "text-amber-600" : "text-emerald-600"}>
                {type === "sukuk" ? "+5.2%" : type === "equity" ? "+8.7%" : "+3.1%"} this year
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
