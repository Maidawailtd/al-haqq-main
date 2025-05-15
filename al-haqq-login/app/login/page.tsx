import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { SocialAuth } from "@/components/auth/social-auth"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Login | Al Haqq Investment",
  description: "Login to your Al Haqq Investment account",
}

export default function LoginPage() {
  return (
    <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="/images/dubai-skyline.jpg"
            width={1280}
            height={843}
            alt="Dubai Skyline"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            <img src="/favicon.ico" alt="Logo" className="mr-2 h-8 w-8" />
            Al Haqq Investment
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Al Haqq Investment has transformed my approach to Shariah-compliant investing. Their platform is
              intuitive and their investment options are diverse and ethical."
            </p>
            <footer className="text-sm">Ahmed Al-Farsi</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>

          <SocialAuth />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <LoginForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
