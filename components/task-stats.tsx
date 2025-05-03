import type { Task } from "./task-manager"

type TaskStatsProps = {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  if (tasks.length === 0) return null

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800/30">
        <div className="text-xs text-gray-500 dark:text-gray-400">Not Started</div>
        <div className="text-lg font-bold text-red-600 dark:text-red-400">
          {tasks.filter((t) => t.applicationStatus === "Not Started").length}
        </div>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-100 dark:border-yellow-800/30">
        <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
          {tasks.filter((t) => t.applicationStatus === "Pending").length}
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-800/30">
        <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
        <div className="text-lg font-bold text-green-600 dark:text-green-400">
          {tasks.filter((t) => t.applicationStatus === "Completed").length}
        </div>
      </div>
    </div>
  )
}
