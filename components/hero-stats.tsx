import { Card, CardContent } from "@/components/ui/card"

export default function HeroStats() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 -mt-16 relative z-20">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">$250M+</div>
              <p className="text-gray-600">Assets Under Management</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">12,000+</div>
              <p className="text-gray-600">Active Investors</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">8-12%</div>
              <p className="text-gray-600">Average Annual Return</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-emerald-700 mb-2">13 Yrs</div>
              <p className="text-gray-600">Industry Experience</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
