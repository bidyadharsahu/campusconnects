"use client"

import { createClient } from "@supabase/supabase-js"

// Create a singleton to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string) => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(key)
      } catch (e) {
        console.error("Error accessing localStorage:", e)
        return null
      }
    }
    return null
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, value)
        return true
      } catch (e) {
        console.error("Error setting localStorage:", e)
        return false
      }
    }
    return false
  },
}

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials are missing. Please check your environment variables.")
      }

      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      // Return null to indicate failure, will be handled by the calling code
      return null
    }
  }
  return supabaseInstance
}

// Check if Supabase is available
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return false

    // Try a simple query to check connectivity
    const { error } = await supabase.from("tasks").select("id").limit(1).maybeSingle()

    // If there's an error other than "no rows found", Supabase might be down
    if (error && error.code !== "PGRST116") {
      console.error("Supabase availability check failed:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Supabase availability check error:", error)
    return false
  }
}

// Mock data for fallback
export const MOCK_TASKS = [
  {
    id: "1",
    internshipName: "Example Company - Software Engineer",
    applicationLink: "https://example.com/careers",
    deadline: "30/06/2023",
    applicationStatus: "Not Started",
    resultStatus: "Pending",
    notes:
      "This position requires knowledge of React and Node.js. The application process includes a technical assessment and two rounds of interviews.",
  },
  {
    id: "2",
    internshipName: "Tech Corp - Frontend Developer",
    applicationLink: "https://techcorp.com/jobs",
    deadline: "15/07/2023",
    applicationStatus: "Pending",
    resultStatus: "Pending",
    notes:
      "This internship focuses on UI/UX design and implementation. They are looking for candidates with experience in modern frontend frameworks.",
  },
]
