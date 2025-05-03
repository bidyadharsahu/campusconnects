"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "./task-manager"
import { PlusCircle, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type TaskFormProps = {
  addTask: (task: Omit<Task, "id">) => void
}

export default function TaskForm({ addTask }: TaskFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [internshipName, setInternshipName] = useState("")
  const [applicationLink, setApplicationLink] = useState("")
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    internshipName?: string
    deadline?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      internshipName?: string
      deadline?: string
    } = {}

    if (!internshipName.trim()) {
      newErrors.internshipName = "Internship name is required"
    }

    if (!deadline.trim()) {
      newErrors.deadline = "Deadline is required"
    } else {
      // Check if deadline is in correct format
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/
      if (!datePattern.test(deadline)) {
        newErrors.deadline = "Deadline must be in DD/MM/YYYY format"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await addTask({
        internshipName,
        applicationLink,
        deadline,
        applicationStatus: "Not Started",
        resultStatus: "Pending",
        notes,
      })

      // Reset form
      setInternshipName("")
      setApplicationLink("")
      setDeadline("")
      setNotes("")
      setIsFormOpen(false)
      setErrors({})
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (input: string) => {
    // Remove non-numeric characters
    const numbers = input.replace(/\D/g, "")

    // Format as DD/MM/YYYY
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value)
    setDeadline(formatted)

    // Clear error when user types
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }))
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternshipName(e.target.value)

    // Clear error when user types
    if (errors.internshipName) {
      setErrors((prev) => ({ ...prev, internshipName: undefined }))
    }
  }

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            key="add-button"
          >
            <Button
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white shadow-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Internship Application
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            key="form"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 relative shadow-sm"
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <Label htmlFor="internshipName" className="dark:text-gray-200">
                  Internship Name *
                </Label>
                <Input
                  id="internshipName"
                  value={internshipName}
                  onChange={handleNameChange}
                  placeholder="Company Name - Position"
                  required
                  className={`dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                    errors.internshipName ? "border-red-500 dark:border-red-500" : ""
                  }`}
                />
                {errors.internshipName && <p className="text-red-500 text-xs mt-1">{errors.internshipName}</p>}
              </div>

              <div>
                <Label htmlFor="applicationLink" className="dark:text-gray-200">
                  Application Link
                </Label>
                <Input
                  id="applicationLink"
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="deadline" className="dark:text-gray-200">
                  Deadline (DD/MM/YYYY) *
                </Label>
                <Input
                  id="deadline"
                  value={deadline}
                  onChange={handleDateChange}
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  required
                  className={`dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                    errors.deadline ? "border-red-500 dark:border-red-500" : ""
                  }`}
                />
                {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
              </div>

              <div>
                <Label htmlFor="notes" className="dark:text-gray-200">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional details about this application..."
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false)
                    setErrors({})
                  }}
                  className="dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
