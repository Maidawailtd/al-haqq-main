import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Registration Successful!</CardTitle>
          <CardDescription>Thank you for creating an account with Al Haqq Investment</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            We've sent a confirmation email to your email address. Please check your inbox and follow the instructions
            to verify your account.
          </p>
          <p className="text-sm text-gray-500">If you don't see the email, please check your spam folder.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
            <Link href="/login">Proceed to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
