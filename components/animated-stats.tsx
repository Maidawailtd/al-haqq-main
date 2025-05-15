"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatProps {
  value: number
  suffix: string
  label: string
  duration?: number
}

function AnimatedStat({ value, suffix, label, duration = 2000 }: StatProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const endValue = value

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease out

      countRef.current = Math.floor(easeProgress * endValue)
      setCount(countRef.current)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isVisible, value, duration])

  return (
    <div ref={ref}>
      <Card className="border-none shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-4xl font-bold text-emerald-700 mb-2">
            {count}
            {suffix}
          </div>
          <p className="text-gray-600">{label}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AnimatedStats() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 -mt-16 relative z-20">
          <AnimatedStat value={250} suffix="M+" label="Assets Under Management" />

          <AnimatedStat value={12000} suffix="+" label="Active Investors" />

          <AnimatedStat value={10} suffix="%" label="Average Annual Return" />

          <AnimatedStat value={13} suffix=" Yrs" label="Industry Experience" />
        </div>
      </div>
    </section>
  )
}
