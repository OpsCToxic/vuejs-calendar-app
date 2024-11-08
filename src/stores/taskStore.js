import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasksByDate: {} // Dictionary to store tasks by date
  }),

  getters: {
    // Get tasks for a specific date
    getTasksForDate: (state) => (date) => {
      const dateKey = date.toDateString() // Convert date to a string key
      return state.tasksByDate[dateKey] || [] // Return tasks or an empty array if none exist
    }
  },

  actions: {
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:8080/tasks/user-tasks', {
          withCredentials: true
        })

        console.log(response.data)

        response.data.forEach((task) => {
          const dateStr = task.time.replace(' ', 'T')
          const parsedDate = new Date(dateStr)

          if (isNaN(parsedDate.getTime())) {
            console.error('Invalid date detected:', task.date)
          } else {
            const dateKey = parsedDate.toDateString()
            if (!this.tasksByDate[dateKey]) {
              this.tasksByDate[dateKey] = []
            }
            this.tasksByDate[dateKey].push(task)
          }
        })
        // Print the updated task store after processing the API response
        console.log('Updated tasksByDate:', this.tasksByDate)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    // Add a new task for a specific date
    addTask(date, task) {
      const dateKey = date.toDateString()
      if (!this.tasksByDate[dateKey]) {
        this.tasksByDate[dateKey] = [] // Initialize an array if no tasks exist for the date
      }
      this.tasksByDate[dateKey].push(task) // Add the new task to the date's task list
    },

    // Update an existing task for a specific date
    updateTask(date, oldTask, newTask) {
      const dateKey = date.toDateString()
      const tasks = this.tasksByDate[dateKey]
      const taskIndex = tasks.indexOf(oldTask)
      if (taskIndex !== -1) {
        tasks[taskIndex] = newTask // Replace the old task with the new task
      }
    },

    // Delete a task for a specific date
    deleteTask(date, task) {
      const dateKey = date.toDateString()
      if (this.tasksByDate[dateKey]) {
        this.tasksByDate[dateKey] = this.tasksByDate[dateKey].filter((t) => t !== task) // Remove the task from the list
      }
    }
  }
})
