import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Al Haqq Investment has transformed how I think about ethical investing. Their Sukuk fund has provided consistent returns while aligning with my values.",
      author: "Ahmed Al-Farsi",
      title: "Investor since 2018",
    },
    {
      quote:
        "The transparency and professionalism of the Al Haqq team is unmatched. I've recommended their services to my entire family.",
      author: "Fatima Rahman",
      title: "Equity Fund Investor",
    },
    {
      quote:
        "As a financial advisor, I appreciate Al Haqq's rigorous Shariah compliance and their commitment to ethical business practices.",
      author: "Mohammed Al-Qasim",
      title: "Financial Consultant",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Investors Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community of investors who have trusted Al Haqq with their financial future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-emerald-500 mb-4" />
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 mr-4 flex items-center justify-center">
                    <span className="text-emerald-700 font-bold">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
