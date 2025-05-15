"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageGallery() {
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = [
    {
      title: "Expert Investment Consultation",
      description:
        "Our expert advisors provide personalized investment guidance tailored to your financial goals and values.",
    },
    {
      title: "Strategic Real Estate Investments",
      description:
        "We identify and invest in prime real estate locations with strong growth potential and stable returns.",
    },
    {
      title: "Shariah-Compliant Principles",
      description:
        "All our investments strictly adhere to Islamic principles, reviewed by our board of Shariah scholars.",
    },
  ]

  const nextSlide = () => {
    setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Investment Approach</h2>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="relative aspect-[16/9] w-full">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeIndex ? "opacity-100" : "opacity-0"
                  } bg-gradient-to-r from-emerald-800 to-teal-700 flex items-center justify-center`}
                  aria-hidden={index !== activeIndex}
                >
                  <CardContent className="text-white p-6 text-center max-w-2xl">
                    <h3 className="text-2xl font-bold mb-4">{slide.title}</h3>
                    <p className="text-lg">{slide.description}</p>
                  </CardContent>
                </div>
              ))}

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === activeIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === activeIndex}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
