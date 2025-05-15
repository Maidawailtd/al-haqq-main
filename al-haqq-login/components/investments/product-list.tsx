"use client"

import { useEffect, useState } from "react"
import type { InvestmentProduct } from "@/types/database"
import ProductCard from "./product-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function ProductList() {
  const [products, setProducts] = useState<InvestmentProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/investment-products?active=true")

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        setError("Failed to load investment products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Group products by type
  const sukukProducts = products.filter((p) => p.type === "sukuk")
  const equityProducts = products.filter((p) => p.type === "equity")
  const realEstateProducts = products.filter((p) => p.type === "real_estate")

  // Find the popular product (could be based on various criteria)
  const popularProduct = products.find((p) => p.type === "equity")

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
  }

  return (
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
  )
}
