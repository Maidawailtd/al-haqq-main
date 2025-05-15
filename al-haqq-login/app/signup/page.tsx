import Link from "next/link"
import { GitHubIcon, GitLabIcon, BitbucketIcon } from "../components/icons"

export default function SignupPage() {
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
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            Log In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <h1 className="text-3xl font-semibold mb-8">Sign Up for Vercel</h1>

          {/* Signup Options */}
          <div className="w-full space-y-4">
            {/* GitHub */}
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#24292E] hover:bg-[#1b1f23] text-white rounded transition">
              <GitHubIcon className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>

            {/* GitLab */}
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#6B4FBB] hover:bg-[#5940a1] text-white rounded transition">
              <GitLabIcon className="w-5 h-5" />
              <span>Continue with GitLab</span>
            </button>

            {/* Bitbucket */}
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0052CC] hover:bg-[#0047b3] text-white rounded transition">
              <BitbucketIcon className="w-5 h-5" />
              <span>Continue with Bitbucket</span>
            </button>
          </div>

          {/* Email Option */}
          <div className="mt-6 w-full flex justify-center">
            <Link href="/signup/email" className="text-[#0070f3] hover:underline">
              Continue with Email →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 mb-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-[#0070f3] hover:underline">
            Log In
          </Link>
        </p>
      </footer>
    </div>
  )
}
