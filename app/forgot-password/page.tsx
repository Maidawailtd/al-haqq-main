import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ForgotPasswordPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is already logged in
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <ForgotPasswordForm />
    </div>
  )
}
