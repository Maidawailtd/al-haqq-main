"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface KycDocumentsProps {
  documents: any[]
  kycStatus: string
}

export default function KycDocuments({ documents, kycStatus }: KycDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadSuccess(false)
    setUploadError(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", documentType)

      // Upload file
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload document")
      }

      setUploadSuccess(true)
      // Refresh the page to show the new document
      window.location.reload()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <div className="flex items-center text-emerald-600">
            <CheckCircle className="h-5 w-5 mr-1" />
            <span>Verified</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center text-red-600">
            <XCircle className="h-5 w-5 mr-1" />
            <span>Rejected</span>
          </div>
        )
      case "submitted":
        return (
          <div className="flex items-center text-blue-600">
            <AlertCircle className="h-5 w-5 mr-1" />
            <span>Under Review</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center text-gray-600">
            <AlertCircle className="h-5 w-5 mr-1" />
            <span>Pending</span>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">KYC Status</h3>
        <div className="flex items-center">
          <div className="mr-4">{getStatusBadge(kycStatus)}</div>
          <div className="text-gray-600">
            {kycStatus === "verified"
              ? "Your identity has been verified. You have full access to all features."
              : kycStatus === "rejected"
                ? "Your verification was rejected. Please upload new documents."
                : kycStatus === "submitted"
                  ? "Your documents are under review. This process usually takes 1-2 business days."
                  : "Please upload your identification documents to verify your identity."}
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">Document uploaded successfully!</div>
      )}
      {uploadError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{uploadError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Required Documents</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="id-document" className="block mb-2">
                ID Document (Passport / National ID)
              </Label>
              <div className="flex items-center">
                <Input
                  id="id-document"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileUpload(e, "id")}
                  disabled={isUploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("id-document")?.click()}
                  disabled={isUploading}
                  className="flex items-center"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload ID Document
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="proof-of-address" className="block mb-2">
                Proof of Address (Utility Bill / Bank Statement)
              </Label>
              <div className="flex items-center">
                <Input
                  id="proof-of-address"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileUpload(e, "address")}
                  disabled={isUploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("proof-of-address")?.click()}
                  disabled={isUploading}
                  className="flex items-center"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload Proof of Address
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Uploaded Documents</h3>
          {documents.length === 0 ? (
            <div className="text-gray-500">No documents uploaded yet.</div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-gray-500" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div>
                      {doc.is_verified ? (
                        <div className="text-emerald-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className="text-amber-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>Pending</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
