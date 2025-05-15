"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"

interface PortfolioChartProps {
  investments: any[]
}

export default function PortfolioChart({ investments }: PortfolioChartProps) {
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

        // Process data for chart
        const dates = new Set<string>()
        performanceData.forEach((data) => {
          data.performance.forEach((p: any) => {
            dates.add(p.date)
          })
        })

        const sortedDates = Array.from(dates).sort()

        const chartData = sortedDates.map((date) => {
          const dataPoint: any = { date }

          performanceData.forEach((data) => {
            const investmentName = data.investment.investment_products.name
            const performanceOnDate = data.performance.find((p: any) => p.date === date)
            if (performanceOnDate) {
              dataPoint[investmentName] = performanceOnDate.value
            }
          })

          return dataPoint
        })

        setChartData(chartData)
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
      const sampleData = []
      const today = new Date()
      const timeRangeMap = {
        "1m": 30,
        "3m": 90,
        "6m": 180,
        "1y": 365,
      }
      const days = timeRangeMap[timeRange as keyof typeof timeRangeMap]

      for (let i = days; i >= 0; i -= days > 90 ? 7 : 1) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]

        const dataPoint: any = { date: dateStr }
        investments.forEach((investment) => {
          const name = investment.investment_products.name
          const initialValue = investment.amount
          const volatility =
            investment.investment_products.type === "sukuk"
              ? 0.05
              : investment.investment_products.type === "equity"
                ? 0.15
                : 0.1
          const growthRate =
            investment.investment_products.type === "sukuk"
              ? 0.06
              : investment.investment_products.type === "equity"
                ? 0.1
                : 0.08
          const daysFactor = (days - i) / days
          const randomFactor = 1 + (Math.random() * 2 - 1) * volatility * daysFactor
          const growthFactor = 1 + growthRate * daysFactor
          dataPoint[name] = Math.round(initialValue * growthFactor * randomFactor)
        })

        sampleData.push(dataPoint)
      }

      setChartData(sampleData)
    }
  }, [loading, chartData, investments, timeRange])

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
        <p>No investments found. Start investing to see your portfolio performance.</p>
      </div>
    )
  }

  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

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
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const d = new Date(date)
                return `${d.getMonth() + 1}/${d.getDate()}`
              }}
            />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => {
                const d = new Date(label)
                return d.toLocaleDateString()
              }}
            />
            <Legend />
            {investments.map((investment, index) => (
              <Line
                key={investment.id}
                type="monotone"
                dataKey={investment.investment_products.name}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
