"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; data: any | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  updatePassword: (password: string) => Promise<{ error: any | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setUser(session?.user || null)
      setLoading(false)

      // Record session if user is logged in
      if (session?.user) {
        recordUserSession(session.user.id)
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session)
        setUser(session?.user || null)

        if (event === "SIGNED_IN" && session?.user) {
          recordUserSession(session.user.id)

          // Update last_login in users table
          await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", session.user.id)
        }

        if (event === "SIGNED_OUT") {
          // Update the logout time for the current session
          const sessionId = localStorage.getItem("current_session_id")
          if (sessionId) {
            await supabase
              .from("user_sessions")
              .update({
                logout_at: new Date().toISOString(),
                session_duration: calculateSessionDuration(sessionId),
              })
              .eq("id", sessionId)

            localStorage.removeItem("current_session_id")
          }
        }

        // Refresh the page to update server components
        router.refresh()
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }

    getUser()
  }, [supabase, router])

  const calculateSessionDuration = async (sessionId: string) => {
    const { data } = await supabase.from("user_sessions").select("login_at").eq("id", sessionId).single()

    if (data?.login_at) {
      const loginTime = new Date(data.login_at).getTime()
      const currentTime = new Date().getTime()
      return Math.floor((currentTime - loginTime) / 1000) // Duration in seconds
    }

    return 0
  }

  const recordUserSession = async (userId: string) => {
    try {
      // Get client information
      const userAgent = navigator.userAgent
      const ipResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipResponse.json()

      // Create session record
      const { data, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: userId,
          ip_address: ipData.ip,
          user_agent: userAgent,
          device_info: getDeviceInfo(),
          login_at: new Date().toISOString(),
        })
        .select()

      if (!error && data?.[0]?.id) {
        // Store session ID for logout tracking
        localStorage.setItem("current_session_id", data[0].id)
      }
    } catch (err) {
      console.error("Error recording user session:", err)
    }
  }

  const getDeviceInfo = () => {
    const platform = navigator.platform
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    return `${platform} (${screenWidth}x${screenHeight})`
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (!error && data.user) {
        // Create user record in users table
        const { error: profileError, data: profileData } = await supabase
          .from("users")
          .insert({
            id: data.user.id,
            email: email,
            full_name: userData.full_name,
            is_active: true,
            is_verified: false,
            marketing_consent: userData.marketing_consent || false,
            data_processing_consent: userData.data_processing_consent || false,
            terms_accepted_at: userData.terms_accepted ? new Date().toISOString() : null,
          })
          .select()

        // Record consent
        if (userData.terms_accepted) {
          await supabase.from("user_consents").insert({
            user_id: data.user.id,
            consent_type: "terms",
            granted: true,
            ip_address: (await (await fetch("https://api.ipify.org?format=json")).json()).ip,
            user_agent: navigator.userAgent,
          })
        }

        if (userData.marketing_consent) {
          await supabase.from("user_consents").insert({
            user_id: data.user.id,
            consent_type: "marketing",
            granted: true,
            ip_address: (await (await fetch("https://api.ipify.org?format=json")).json()).ip,
            user_agent: navigator.userAgent,
          })
        }

        if (userData.data_processing_consent) {
          await supabase.from("user_consents").insert({
            user_id: data.user.id,
            consent_type: "data_processing",
            granted: true,
            ip_address: (await (await fetch("https://api.ipify.org?format=json")).json()).ip,
            user_agent: navigator.userAgent,
          })
        }

        return { error: profileError, data: profileData }
      }

      return { error, data }
    } catch (error) {
      return { error, data: null }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.refreshSession()
      setSession(data.session)
      setUser(data.session?.user || null)
    } catch (error) {
      console.error("Error refreshing session:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
