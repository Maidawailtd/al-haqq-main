export default function VideoHero() {
  return (
    <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="absolute min-w-full min-h-full object-cover">
          <source src="/videos/islamic-finance.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-emerald-900/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Ethical Investments for a Sustainable Future
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
          Al Haqq Investment provides Shariah-compliant investment opportunities with competitive returns and ethical
          business practices.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            Start Investing
          </a>
          <a
            href="/about"
            className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}
