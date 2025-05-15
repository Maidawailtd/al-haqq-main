import { getServerUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserProfile from "@/components/dashboard/user-profile"
import ChangePassword from "@/components/dashboard/change-password"
import KycStatus from "@/components/kyc/kyc-status"
import UserPreferences from "@/components/dashboard/user-preferences"

export default async function ProfilePage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/login?redirect=/dashboard/profile")
  }

  const supabase = getSupabaseServerClient()

  // Get user's profile data
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's KYC documents
  const { data: documents } = await supabase
    .from("kyc_documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-600 mb-8">Manage your personal information and account settings</p>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <UserProfile userId={user.id} profileData={profileData} />
        </TabsContent>

        <TabsContent value="security">
          <ChangePassword />
        </TabsContent>

        <TabsContent value="kyc">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <KycStatus userId={user.id} />
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Why we need to verify your identity</h3>
              <p className="text-blue-700 mb-4">
                As a regulated financial service, we are required to verify the identity of all our customers. This
                helps prevent fraud and ensures compliance with anti-money laundering regulations.
              </p>
              <a href="/dashboard/kyc" className="text-emerald-700 hover:underline font-medium">
                Go to KYC verification page →
              </a>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <UserPreferences userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
