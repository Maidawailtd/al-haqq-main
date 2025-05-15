import Link from "next/link"

export default function Logo({ className = "", size = "default" }) {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-16 h-16",
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-700">
          <path d="M20 2L38 32H2L20 2Z" fill="currentColor" />
          <path d="M20 9L29 25H11L20 9Z" fill="white" />
          <path d="M20 16L23 22H17L20 16Z" fill="currentColor" />
        </svg>
      </div>
      <span className={`font-bold ${size === "small" ? "text-lg" : "text-xl"} text-gray-900 dark:text-white`}>
        Al Haqq Investment
      </span>
    </Link>
  )
}
