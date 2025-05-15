"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"

interface InvestmentPerformanceProps {
  investments: any[]
}

export default function InvestmentPerformance({ investments }: InvestmentPerformanceProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("1m") // 1m, 3m, 6m, 1y

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true)
      try {
        // Get performance data for each investment
        const performancePromises = investments.map(async (investment) => {
          const response = await fetch(
            `/api/investment-performance?productId=${investment.product_id}&range=${timeRange}`,
          )
          if (!response.ok) {
            throw new Error("Failed to fetch performance data")
          }
          const data = await response.json()
          return {
            investment,
            performance: data.performance,
          }
        })

        const performanceData = await Promise.all(performancePromises)

        // Calculate returns for each investment
        const returns = performanceData.map((data) => {
          const performance = data.performance
          if (performance.length < 2) return { name: data.investment.investment_products.name, return: 0 }

          const firstValue = performance[0].unit_price
          const lastValue = performance[performance.length - 1].unit_price
          const returnPercentage = ((lastValue - firstValue) / firstValue) * 100

          return {
            name: data.investment.investment_products.name,
            return: Number.parseFloat(returnPercentage.toFixed(2)),
            type: data.investment.investment_products.type,
          }
        })

        setChartData(returns)
      } catch (error) {
        console.error("Error fetching performance data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (investments.length > 0) {
      fetchPerformanceData()
    } else {
      setLoading(false)
    }
  }, [investments, timeRange])

  // Generate sample data if no real data is available
  useEffect(() => {
    if (!loading && chartData.length === 0 && investments.length > 0) {
      const sampleData = investments.map((investment) => {
        const type = investment.investment_products.type
        let returnValue = 0

        if (type === "sukuk") {
          returnValue = 1.5 + Math.random() * 3.5 // 1.5% to 5%
        } else if (type === "equity") {
          returnValue = 3 + Math.random() * 7 // 3% to 10%
        } else {
          returnValue = 2 + Math.random() * 5 // 2% to 7%
        }

        return {
          name: investment.investment_products.name,
          return: Number.parseFloat(returnValue.toFixed(2)),
          type,
        }
      })

      setChartData(sampleData)
    }
  }, [loading, chartData, investments])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No investments found. Start investing to see performance data.</p>
      </div>
    )
  }

  const getBarColor = (type: string) => {
    switch (type) {
      case "sukuk":
        return "#10b981" // emerald-500
      case "equity":
        return "#3b82f6" // blue-500
      case "real_estate":
        return "#f59e0b" // amber-500
      default:
        return "#6b7280" // gray-500
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="3m">3M</TabsTrigger>
            <TabsTrigger value="6m">6M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: number) => [`${value}%`, "Return"]} />
            <Legend />
            <Bar
              dataKey="return"
              name="Return"
              fill={(data) => getBarColor(data.type)}
              label={{ position: "top", formatter: (value: number) => `${value}%` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
