"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface InvestmentPerformanceChartProps {
  productId: string
  performanceData: any[]
}

export default function InvestmentPerformanceChart({ productId, performanceData }: InvestmentPerformanceChartProps) {
  const [timeRange, setTimeRange] = useState("1m") // 1m, 3m, 6m, 1y

  // Generate sample data if no real data is available
  const chartData = performanceData.length > 0 ? performanceData : generateSampleData(timeRange)

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
            <YAxis yAxisId="left" tickFormatter={(value) => `$${value.toFixed(2)}`} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(2)}%`} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "Unit Price") return [`$${value.toFixed(2)}`, name]
                return [`${value.toFixed(2)}%`, name]
              }}
              labelFormatter={(label) => {
                const d = new Date(label)
                return d.toLocaleDateString()
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="unit_price"
              name="Unit Price"
              stroke="#10b981"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="change_percentage"
              name="Daily Change"
              stroke="#3b82f6"
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function generateSampleData(timeRange: string) {
  const data = []
  const today = new Date()
  const timeRangeMap = {
    "1m": 30,
    "3m": 90,
    "6m": 180,
    "1y": 365,
  }
  const days = timeRangeMap[timeRange as keyof typeof timeRangeMap]

  let price = 100 // Starting price
  for (let i = days; i >= 0; i -= days > 90 ? 7 : 1) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    // Generate random price change (-1.5% to +1.5%)
    const change = Math.random() * 3 - 1.5
    price = price * (1 + change / 100)

    data.push({
      date: dateStr,
      unit_price: Number.parseFloat(price.toFixed(2)),
      change_percentage: Number.parseFloat(change.toFixed(2)),
    })
  }

  return data
}
