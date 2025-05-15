import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { InvestmentProduct } from "@/types/database"
import { Check } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: InvestmentProduct
  isPopular?: boolean
}

export default function ProductCard({ product, isPopular = false }: ProductCardProps) {
  // Generate features based on product data
  const features = [
    `Expected annual return: ${product.expected_return_min}-${product.expected_return_max}%`,
    `${product.risk_level.charAt(0).toUpperCase() + product.risk_level.slice(1)} risk profile`,
    product.profit_distribution_frequency
      ? `${product.profit_distribution_frequency.charAt(0).toUpperCase() + product.profit_distribution_frequency.slice(1)} profit distribution`
      : "Regular profit distribution",
    product.duration_months
      ? `Minimum investment period: ${
          product.duration_months > 12
            ? `${Math.floor(product.duration_months / 12)} year${Math.floor(product.duration_months / 12) > 1 ? "s" : ""}`
            : `${product.duration_months} months`
        }`
      : "Flexible investment period",
    product.type === "sukuk"
      ? "No early withdrawal fees"
      : product.type === "equity"
        ? "Access to exclusive market reports"
        : "Quarterly performance updates",
  ]

  return (
    <Card className={`border ${isPopular ? "border-emerald-500 shadow-lg" : "border-gray-200"} relative`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
          Popular
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-700 font-bold">{product.name.charAt(0)}</span>
          </div>
          <CardTitle className="text-2xl">{product.name}</CardTitle>
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <span className="text-4xl font-bold">${product.min_investment.toLocaleString()}</span>
          <span className="text-gray-500 ml-2">minimum</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className={`w-full ${isPopular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>
          <Link href={`/investments/${product.id}`}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
