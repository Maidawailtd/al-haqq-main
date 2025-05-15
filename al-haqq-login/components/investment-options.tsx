import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

export default function InvestmentOptions() {
  const investmentOptions = [
    {
      title: "Sukuk Fund",
      description: "Fixed income Shariah-compliant investment certificates",
      price: "$5,000",
      features: [
        "Expected annual return: 5-7%",
        "Low risk profile",
        "Quarterly profit distribution",
        "Minimum investment period: 1 year",
        "No early withdrawal fees",
      ],
      popular: false,
    },
    {
      title: "Ethical Equity Fund",
      description: "Diversified portfolio of Shariah-compliant stocks",
      price: "$10,000",
      features: [
        "Expected annual return: 8-12%",
        "Medium risk profile",
        "Bi-annual profit distribution",
        "Minimum investment period: 3 years",
        "Access to exclusive market reports",
      ],
      popular: true,
    },
    {
      title: "Real Estate Fund",
      description: "Investment in Shariah-compliant commercial properties",
      price: "$25,000",
      features: [
        "Expected annual return: 10-15%",
        "Medium-high risk profile",
        "Annual profit distribution",
        "Minimum investment period: 5 years",
        "Quarterly performance updates",
      ],
      popular: false,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Investment Options</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our range of Shariah-compliant investment funds designed to meet different financial goals and
            risk appetites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {investmentOptions.map((option, index) => (
            <Card
              key={index}
              className={`border ${option.popular ? "border-emerald-500 shadow-lg" : "border-gray-200"} relative`}
            >
              {option.popular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 font-bold">{option.title.charAt(0)}</span>
                  </div>
                  <CardTitle className="text-2xl">{option.title}</CardTitle>
                </div>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{option.price}</span>
                  <span className="text-gray-500 ml-2">minimum</span>
                </div>
                <ul className="space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={`w-full ${option.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>
                  <Link href="/investments">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
