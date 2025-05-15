import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, Users } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Yusuf Al-Qaradawi",
      title: "Founder & Chairman",
      bio: "With over 30 years of experience in Islamic finance, Dr. Yusuf leads our vision for ethical investments.",
    },
    {
      name: "Aisha Rahman",
      title: "Chief Investment Officer",
      bio: "Former head of Islamic banking at a major financial institution with expertise in Sukuk and equity markets.",
    },
    {
      name: "Mohammed Al-Azhari",
      title: "Head of Shariah Compliance",
      bio: "Islamic scholar with a PhD in Islamic Finance ensuring all investments meet strict Shariah standards.",
    },
    {
      name: "Sarah Abdullah",
      title: "Director of Client Relations",
      bio: "Dedicated to providing exceptional service and building lasting relationships with our investors.",
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission & Values</h1>
            <p className="text-xl">
              Al Haqq Investment was founded with a clear purpose: to provide ethical, Shariah-compliant investment
              opportunities that generate competitive returns while upholding the highest moral standards.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Founded in 2010, Al Haqq Investment emerged from a vision to bridge the gap between ethical Islamic
                principles and modern investment strategies.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Our founders recognized that many Muslims were seeking investment opportunities that would not
                compromise their religious values, yet still provide strong financial returns.
              </p>
              <p className="text-lg text-gray-700">
                Starting with a small team of dedicated professionals, we have grown to become one of the leading
                Islamic investment firms, managing over $250 million in assets for more than 12,000 investors worldwide.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <p className="text-sm">Company headquarters image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Shariah Compliance</h3>
                <p className="text-gray-600">
                  We strictly adhere to Islamic financial principles in all our investments and business practices, with
                  oversight from respected Shariah scholars.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Award className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We pursue excellence in everything we do, from investment research and selection to client service and
                  reporting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community Impact</h3>
                <p className="text-gray-600">
                  We believe in making a positive difference in the communities we serve, through ethical investments
                  and charitable initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-none shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <p className="text-sm">Team member photo</p>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-emerald-700 mb-3">{member.title}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
