"use client"
import { useState } from "react"
import type { Task } from "./task-manager"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ExternalLink, AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type TaskTableProps = {
  tasks: Task[]
  deleteTask: (id: string) => void
  updateTask: (task: Task) => void
  isMobile: boolean
}

export default function TaskTable({ tasks, deleteTask, updateTask, isMobile }: TaskTableProps) {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({})
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border dark:border-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border dark:border-yellow-800"
      case "Completed":
      case "Selected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border dark:border-gray-600"
    }
  }

  const handleStatusChange = async (task: Task, value: "Not Started" | "Pending" | "Completed") => {
    setIsUpdating(task.id)
    try {
      await updateTask({
        ...task,
        applicationStatus: value,
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleResultChange = async (task: Task, value: "Selected" | "Rejected" | "Pending") => {
    setIsUpdating(task.id)
    try {
      await updateTask({
        ...task,
        resultStatus: value,
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return

    setIsDeleting(true)
    try {
      await deleteTask(taskToDelete.id)
    } finally {
      setIsDeleting(false)
      setTaskToDelete(null)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p className="mb-2 dark:text-gray-300">No internship applications found</p>
          <p className="text-sm dark:text-gray-400">Add your first one using the button above!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Collapsible
            key={task.id}
            open={expandedTasks[task.id]}
            onOpenChange={() => toggleTaskExpansion(task.id)}
            className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
          >
            <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{task.internshipName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deadline: {task.deadline}</p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Select
                  value={task.applicationStatus}
                  onValueChange={(value: "Not Started" | "Pending" | "Completed") => handleStatusChange(task, value)}
                  disabled={isUpdating === task.id}
                >
                  <SelectTrigger className={`w-28 h-8 text-xs ${getStatusColor(task.applicationStatus)}`}>
                    <SelectValue placeholder="Status" />
                    {isUpdating === task.id && (
                      <span className="ml-2 h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                    <SelectItem value="Not Started" className="text-red-600 font-medium dark:text-red-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        Not Started
                      </div>
                    </SelectItem>
                    <SelectItem value="Pending" className="text-yellow-600 font-medium dark:text-yellow-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="Completed" className="text-green-600 font-medium dark:text-green-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={task.resultStatus}
                  onValueChange={(value: "Selected" | "Rejected" | "Pending") => handleResultChange(task, value)}
                  disabled={isUpdating === task.id}
                >
                  <SelectTrigger className={`w-28 h-8 text-xs ${getStatusColor(task.resultStatus)}`}>
                    <SelectValue placeholder="Result" />
                    {isUpdating === task.id && (
                      <span className="ml-2 h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                    <SelectItem value="Pending" className="text-yellow-600 font-medium dark:text-yellow-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="Selected" className="text-green-600 font-medium dark:text-green-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Selected
                      </div>
                    </SelectItem>
                    <SelectItem value="Rejected" className="text-red-600 font-medium dark:text-red-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        Rejected
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  {task.applicationLink && (
                    <a
                      href={task.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center dark:text-blue-400 text-sm"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Link
                    </a>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTaskToDelete(task)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      {expandedTasks[task.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="px-4 pb-4 border-t dark:border-gray-700 pt-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {task.notes ? (
                    <div>
                      <h4 className="font-medium mb-1">Notes:</h4>
                      <p className="whitespace-pre-line">{task.notes}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No additional notes for this application.</p>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.internshipName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
