// stores/taskStore.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref({}) // Store tasks in an object with dates as keys

  // Load tasks from local storage on initialization
  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks)
    }
  }

  // Save tasks to local storage
  const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }

  // Function to get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateKey = date.toDateString()
    return tasks.value[dateKey] || []
  }

  // Function to add a task
  const addTask = (date, task) => {
    const dateKey = date.toDateString()
    if (!tasks.value[dateKey]) {
      tasks.value[dateKey] = []
    }
    tasks.value[dateKey].push(task)
  }

  // Function to delete a task
  const deleteTask = (date, taskIndex) => {
    const dateKey = date.toDateString()
    if (tasks.value[dateKey]) {
      tasks.value[dateKey].splice(taskIndex, 1)
      if (tasks.value[dateKey].length === 0) {
        delete tasks.value[dateKey] // Remove the date key if no tasks are left
      }
    }
  }

  // Watch tasks and save to local storage whenever they change
  watch(tasks, saveTasksToLocalStorage, { deep: true })

  // Load tasks from local storage when the store is initialized
  loadTasksFromLocalStorage()

  return { tasks, getTasksForDate, addTask, deleteTask }
})
