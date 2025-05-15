"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { recordAuditLog } from "@/lib/audit"

type DocumentUploadProps = {
  userId: string
}

export default function DocumentUpload({ userId }: DocumentUploadProps) {
  const [documentType, setDocumentType] = useState<string>("")
  const [documentNumber, setDocumentNumber] = useState<string>("")
  const [issueDate, setIssueDate] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const supabase = getSupabaseBrowserClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("kyc-documents")
        .upload(fileName, file)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("kyc-documents").getPublicUrl(fileName)

      // Save document metadata to database
      const { error: dbError } = await supabase.from("kyc_documents").insert({
        user_id: userId,
        document_type: documentType,
        document_number: documentNumber,
        issue_date: issueDate,
        expiry_date: expiryDate,
        document_url: publicUrl,
        verification_status: "pending",
      })

      if (dbError) {
        throw new Error(dbError.message)
      }

      // Record audit log
      await recordAuditLog({
        userId,
        action: "UPLOAD",
        entity: "kyc_document",
        details: { documentType },
      })

      setSuccess(true)

      // Reset form
      setDocumentType("")
      setDocumentNumber("")
      setIssueDate("")
      setExpiryDate("")
      setFile(null)
    } catch (err: any) {
      setError(err.message || "An error occurred during upload")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload KYC Document</CardTitle>
        <CardDescription>Please upload your identification documents for verification</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-600 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Document uploaded successfully! It will be reviewed shortly.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="driving_license">Driving License</SelectItem>
                  <SelectItem value="residence_permit">Residence Permit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number</Label>
              <Input
                id="documentNumber"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentFile">Upload Document</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Input
                  id="documentFile"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,application/pdf"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("documentFile")?.click()}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
                <p className="text-sm text-gray-500">{file ? file.name : "JPG, PNG or PDF, max 5MB"}</p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isUploading || !file}
          className="w-full bg-emerald-700 hover:bg-emerald-800"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Document"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
