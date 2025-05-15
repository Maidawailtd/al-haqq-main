import { createBrowserClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton to prevent multiple instances
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return document.cookie
              .split("; ")
              .find((row) => row.startsWith(`${name}=`))
              ?.split("=")[1]
          },
          set(name: string, value: string, options: CookieOptions) {
            let cookie = `${name}=${value}`
            if (options.maxAge) {
              cookie += `; Max-Age=${options.maxAge}`
            }
            if (options.path) {
              cookie += `; Path=${options.path}`
            }
            if (options.sameSite) {
              cookie += `; SameSite=${options.sameSite}`
            }
            if (options.domain) {
              cookie += `; Domain=${options.domain}`
            }
            if (options.secure) {
              cookie += "; Secure"
            }
            document.cookie = cookie
          },
          remove(name: string, options: CookieOptions) {
            this.set(name, "", { ...options, maxAge: -1 })
          },
        },
      },
    )
  }
  return supabaseClient
}
