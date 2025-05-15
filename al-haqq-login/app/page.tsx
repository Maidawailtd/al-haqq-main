import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, Shield, TrendingUp, Users } from "lucide-react"
import Testimonials from "@/components/testimonials"
import InvestmentOptions from "@/components/investment-options"
import HeroStats from "@/components/hero-stats"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-900 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Ethical Investments for a Sustainable Future</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Al Haqq Investment provides Shariah-compliant investment opportunities with competitive returns and
              ethical business practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register">Start Investing</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <HeroStats />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Al Haqq Investment?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine ethical investment principles with modern financial strategies to maximize returns while
              maintaining Shariah compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Shariah Compliant</h3>
                <p className="text-gray-600">
                  All investments strictly follow Islamic financial principles and are regularly audited by Shariah
                  scholars.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Competitive Returns</h3>
                <p className="text-gray-600">
                  Our investment strategies are designed to deliver strong returns while managing risk appropriately.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Management</h3>
                <p className="text-gray-600">
                  Our team of experienced investment professionals has a proven track record in Islamic finance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transparent Reporting</h3>
                <p className="text-gray-600">
                  Regular updates and comprehensive reporting keep you informed about your investment performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Options */}
      <InvestmentOptions />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Ethical Investment Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of investors who have chosen Al Haqq for their Shariah-compliant investment needs.
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-gray-100">
            <Link href="/register" className="flex items-center gap-2">
              Create Your Account <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
