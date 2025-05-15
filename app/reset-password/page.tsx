import ResetPasswordForm from "@/components/auth/reset-password-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function ResetPasswordPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is already logged in
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session, the user needs to access this page via the reset password email
  // If there is a session, they can reset their password while logged in

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <ResetPasswordForm />
    </div>
  )
}
