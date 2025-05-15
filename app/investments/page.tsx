import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import Link from "next/link"

export default async function InvestmentsPage() {
  const supabase = getSupabaseServerClient()

  // Get all active investment products
  const { data: products, error } = await supabase
    .from("investment_products")
    .select("*")
    .eq("is_active", true)
    .order("name")

  if (error) {
    console.error("Error fetching investment products:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Investment Opportunities</h1>
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load investment products. Please try again later.
        </div>
      </div>
    )
  }

  // Group products by type
  const sukukProducts = products.filter((p) => p.type === "sukuk")
  const equityProducts = products.filter((p) => p.type === "equity")
  const realEstateProducts = products.filter((p) => p.type === "real_estate")

  // Find the popular product (could be based on various criteria)
  const popularProduct = products.find((p) => p.type === "equity")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Investment Opportunities</h1>
      <p className="text-gray-600 mb-8">
        Explore our range of Shariah-compliant investment options designed to meet your financial goals
      </p>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="all">All Investments</TabsTrigger>
            <TabsTrigger value="sukuk">Sukuk</TabsTrigger>
            <TabsTrigger value="equity">Equity</TabsTrigger>
            <TabsTrigger value="realestate">Real Estate</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isPopular={popularProduct && product.id === popularProduct.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sukuk">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sukukProducts.length > 0 ? (
              sukukProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No Sukuk investment products available at the moment.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="equity">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equityProducts.length > 0 ? (
              equityProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isPopular={popularProduct && product.id === popularProduct.id}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No Equity investment products available at the moment.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="realestate">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realEstateProducts.length > 0 ? (
              realEstateProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No Real Estate investment products available at the moment.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductCard({ product, isPopular = false }: { product: any; isPopular?: boolean }) {
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
