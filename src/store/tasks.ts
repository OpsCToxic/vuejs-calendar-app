import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasksStore', {
  state: () => ({
    tasks: new Map()
  }),
  actions: {}
})