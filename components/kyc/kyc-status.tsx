"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { KycDocument } from "@/types/database"

type KycStatusProps = {
  userId: string
}

export default function KycStatus({ userId }: KycStatusProps) {
  const [documents, setDocuments] = useState<KycDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<string>("pending")

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { data, error } = await supabase
          .from("kyc_documents")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setDocuments(data || [])

        // Determine overall verification status
        if (data && data.length > 0) {
          const statuses = data.map((doc) => doc.verification_status)

          if (statuses.includes("verified")) {
            setVerificationStatus("verified")
          } else if (statuses.includes("rejected")) {
            setVerificationStatus("rejected")
          } else if (statuses.includes("pending")) {
            setVerificationStatus("pending")
          }
        } else {
          setVerificationStatus("not_submitted")
        }
      } catch (error) {
        console.error("Error fetching KYC documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [userId, supabase])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "rejected":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "pending":
        return <Clock className="h-6 w-6 text-amber-500" />
      default:
        return <AlertCircle className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Your identity has been verified"
      case "rejected":
        return "Your verification was rejected. Please upload new documents."
      case "pending":
        return "Your documents are under review. This usually takes 1-2 business days."
      case "not_submitted":
        return "Please upload your identification documents to verify your identity."
      default:
        return "Status unknown"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-50 border-green-200"
      case "rejected":
        return "bg-red-50 border-red-200"
      case "pending":
        return "bg-amber-50 border-amber-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card className={`border ${getStatusColor(verificationStatus)}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          {getStatusIcon(verificationStatus)}
          <span className="ml-2">KYC Verification Status</span>
        </CardTitle>
        <CardDescription>{getStatusText(verificationStatus)}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading documents...</p>
        ) : documents.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Submitted Documents</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-md border">
                  <div>
                    <p className="font-medium">{doc.document_type.replace("_", " ").toUpperCase()}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(doc.verification_status)}
                    <span className="ml-2 text-sm">
                      {doc.verification_status.charAt(0).toUpperCase() + doc.verification_status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No documents submitted yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
