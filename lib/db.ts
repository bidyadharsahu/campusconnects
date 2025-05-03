"use client"

import type { Task } from "@/components/task-manager"
import { getSupabaseClient, isSupabaseAvailable, MOCK_TASKS } from "./supabase/client"

// Helper function to safely access localStorage for fallback
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

// Database operations
export const db = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase client not initialized")

        const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        if (data) {
          // Transform from snake_case to camelCase
          const transformedData = data.map((item) => ({
            id: item.id,
            internshipName: item.internship_name,
            applicationLink: item.application_link,
            deadline: item.deadline,
            applicationStatus: item.application_status,
            resultStatus: item.result_status,
            notes: item.notes,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }))

          // Also update localStorage as a cache
          safeLocalStorage.setItem("internship-tasks", JSON.stringify(transformedData))

          return transformedData
        }
      }

      // Fallback to localStorage if Supabase is not available or no data
      console.log("Falling back to localStorage for tasks")
      const localTasks = safeLocalStorage.getItem("internship-tasks")
      if (localTasks) {
        return JSON.parse(localTasks) as Task[]
      }

      return MOCK_TASKS
    } catch (error) {
      console.error("Error fetching tasks:", error)

      // Fallback to localStorage
      const localTasks = safeLocalStorage.getItem("internship-tasks")
      if (localTasks) {
        return JSON.parse(localTasks) as Task[]
      }

      return MOCK_TASKS
    }
  },

  // Add a new task
  addTask: async (task: Omit<Task, "id">): Promise<Task> => {
    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase client not initialized")

        // Transform to snake_case for database
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            internship_name: task.internshipName,
            application_link: task.applicationLink,
            deadline: task.deadline,
            application_status: task.applicationStatus,
            result_status: task.resultStatus,
            notes: task.notes,
          })
          .select()

        if (error) {
          throw error
        }

        if (data && data[0]) {
          // Transform back to camelCase
          const newTask: Task = {
            id: data[0].id,
            internshipName: data[0].internship_name,
            applicationLink: data[0].application_link,
            deadline: data[0].deadline,
            applicationStatus: data[0].application_status,
            resultStatus: data[0].result_status,
            notes: data[0].notes,
            createdAt: data[0].created_at,
            updatedAt: data[0].updated_at,
          }

          // Also update localStorage as fallback
          const localTasks = safeLocalStorage.getItem("internship-tasks")
          const tasks = localTasks ? (JSON.parse(localTasks) as Task[]) : []
          safeLocalStorage.setItem("internship-tasks", JSON.stringify([newTask, ...tasks]))

          return newTask
        }
      }

      // Fallback to localStorage
      console.log("Falling back to localStorage for adding task")
      const newTask = {
        id: Date.now().toString(),
        ...task,
      }

      const localTasks = safeLocalStorage.getItem("internship-tasks")
      const tasks = localTasks ? (JSON.parse(localTasks) as Task[]) : []
      safeLocalStorage.setItem("internship-tasks", JSON.stringify([newTask, ...tasks]))

      return newTask
    } catch (error) {
      console.error("Error adding task:", error)

      // Fallback to localStorage
      const newTask = {
        id: Date.now().toString(),
        ...task,
      }

      const localTasks = safeLocalStorage.getItem("internship-tasks")
      const tasks = localTasks ? (JSON.parse(localTasks) as Task[]) : []
      safeLocalStorage.setItem("internship-tasks", JSON.stringify([newTask, ...tasks]))

      return newTask
    }
  },

  // Update a task
  updateTask: async (updatedTask: Task): Promise<Task> => {
    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase client not initialized")

        // Transform to snake_case for database
        const { error } = await supabase
          .from("tasks")
          .update({
            internship_name: updatedTask.internshipName,
            application_link: updatedTask.applicationLink,
            deadline: updatedTask.deadline,
            application_status: updatedTask.applicationStatus,
            result_status: updatedTask.resultStatus,
            notes: updatedTask.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", updatedTask.id)

        if (error) {
          throw error
        }
      }

      // Always update localStorage as fallback
      const localTasks = safeLocalStorage.getItem("internship-tasks")
      if (localTasks) {
        const tasks = JSON.parse(localTasks) as Task[]
        const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        safeLocalStorage.setItem("internship-tasks", JSON.stringify(updatedTasks))
      }

      return updatedTask
    } catch (error) {
      console.error("Error updating task:", error)

      // Fallback to localStorage
      const localTasks = safeLocalStorage.getItem("internship-tasks")
      if (localTasks) {
        const tasks = JSON.parse(localTasks) as Task[]
        const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        safeLocalStorage.setItem("internship-tasks", JSON.stringify(updatedTasks))
      }

      return updatedTask
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<boolean> => {
    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase client not initialized")

        const { error } = await supabase.from("tasks").delete().eq("id", id)

        if (error) {
          throw error
        }
      }

      // Always update localStorage as fallback
      const localTasks = safeLocalStorage.getItem("internship-tasks")
      if (localTasks) {
        const tasks = JSON.parse(localTasks) as Task[]
        const updatedTasks = tasks.filter((task) => task.id !== id)
        safeLocalStorage.setItem("internship-tasks", JSON.stringify(updatedTasks))
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error)

      // Fallback to localStorage
      const localTasks = safeLocalStorage.getItem("internship-tasks")
      if (localTasks) {
        const tasks = JSON.parse(localTasks) as Task[]
        const updatedTasks = tasks.filter((task) => task.id !== id)
        safeLocalStorage.setItem("internship-tasks", JSON.stringify(updatedTasks))
      }

      return true
    }
  },

  // Get task statistics
  getStats: async (): Promise<{
    total: number
    notStarted: number
    pending: number
    completed: number
    selected: number
    rejected: number
    upcomingDeadlines: Task[]
  }> => {
    try {
      const tasks = await db.getTasks()

      const notStarted = tasks.filter((t) => t.applicationStatus === "Not Started").length
      const pending = tasks.filter((t) => t.applicationStatus === "Pending").length
      const completed = tasks.filter((t) => t.applicationStatus === "Completed").length

      const selected = tasks.filter((t) => t.resultStatus === "Selected").length
      const rejected = tasks.filter((t) => t.resultStatus === "Rejected").length

      // Get upcoming deadlines (next 7 days)
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)

      const upcomingDeadlines = tasks
        .filter((task) => {
          if (!task.deadline) return false

          const [day, month, year] = task.deadline.split("/").map(Number)
          const deadlineDate = new Date(year, month - 1, day)

          return deadlineDate >= today && deadlineDate <= nextWeek
        })
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.deadline.split("/").map(Number)
          const [dayB, monthB, yearB] = b.deadline.split("/").map(Number)

          const dateA = new Date(yearA, monthA - 1, dayA)
          const dateB = new Date(yearB, monthB - 1, dayB)

          return dateA.getTime() - dateB.getTime()
        })

      return {
        total: tasks.length,
        notStarted,
        pending,
        completed,
        selected,
        rejected,
        upcomingDeadlines,
      }
    } catch (error) {
      console.error("Error getting stats:", error)
      return {
        total: 0,
        notStarted: 0,
        pending: 0,
        completed: 0,
        selected: 0,
        rejected: 0,
        upcomingDeadlines: [],
      }
    }
  },
}
