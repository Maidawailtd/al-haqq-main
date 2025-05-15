import Link from "next/link"

export default function EmailLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 w-full">
        <Link href="/">
          <div className="cursor-pointer">
            <div className="w-6 h-6">
              <svg viewBox="0 0 76 65" fill="currentColor">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
          </div>
        </Link>
        <div className="flex gap-6">
          <Link href="/contact" className="text-sm text-gray-600 hover:text-black">
            Contact
          </Link>
          <Link href="/signup" className="text-sm text-gray-600 hover:text-black">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-8 text-center">Log in with Email</h1>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white rounded transition">
              Continue with Email
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-[#0070f3] hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 mb-8 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#0070f3] hover:underline">
            Sign Up
          </Link>
        </p>
      </footer>
    </div>
  )
}
