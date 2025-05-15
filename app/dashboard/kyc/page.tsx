import { getServerUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import DocumentUpload from "@/components/kyc/document-upload"
import KycStatus from "@/components/kyc/kyc-status"

export default async function KycPage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/login?redirect=/dashboard/kyc")
  }

  const supabase = getSupabaseServerClient()

  // Get user's KYC documents
  const { data: documents } = await supabase
    .from("kyc_documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
      <p className="text-gray-600 mb-8">
        To comply with regulatory requirements, we need to verify your identity before you can invest.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <KycStatus userId={user.id} />
        </div>

        <div>
          <DocumentUpload userId={user.id} />
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-200">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Why we need to verify your identity</h2>
        <p className="text-blue-700">
          As a regulated financial service, we are required to verify the identity of all our customers. This helps
          prevent fraud and ensures compliance with anti-money laundering regulations. Your information is securely
          stored and protected in accordance with our privacy policy.
        </p>
      </div>
    </div>
  )
}
