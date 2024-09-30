<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'

// UI State
const currentDate = ref(new Date())
const taskDialog = ref(false)
const selectedDay = ref(null)

// Days of the week for the header
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Populate the days array with days of the current month and adjacent days
const days = computed(() => {
  const date = currentDate.value
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const array = []

  // Calculate the number of days from the previous month to show at the start
  const prevMonthLastDay = new Date(firstDayOfMonth)
  prevMonthLastDay.setDate(0) // Sets to the last day of the previous month
  const prevDaysCount = firstDayOfMonth.getDay() // Number of days to show from the previous month

  // Add days from the previous month
  for (let i = prevDaysCount - 1; i >= 0; i--) {
    const prevMonthDay = new Date(prevMonthLastDay)
    prevMonthDay.setDate(prevMonthLastDay.getDate() - i)
    array.push({ date: prevMonthDay, tasks: [], notCurrentMonth: true })
  }

  // Add days of the current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    array.push({
      date: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day),
      tasks: [],
      notCurrentMonth: false
    })
  }

  // Calculate the number of days from the next month to fill the last week
  const nextDaysCount = 7 - (array.length % 7) // Days needed to complete the last row
  if (nextDaysCount < 7) {
    for (let i = 1; i <= nextDaysCount; i++) {
      const nextMonthDay = new Date(lastDayOfMonth)
      nextMonthDay.setDate(lastDayOfMonth.getDate() + i)
      array.push({ date: nextMonthDay, tasks: [], notCurrentMonth: true })
    }
  }

  return array
})

// Open dialog to add or edit a task
const openAddTaskDialog = (day) => {
  selectedDay.value = day
  taskDialog.value = true
  console.log('henlo')
}

// Navigate to the previous month
const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
}

// Navigate to the next month
const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1)
}

// Initialize calendar with the current month
</script>

<template>
  <div class="calendar-container">
    <div class="task-calendar">
      <h1>Task Calendar</h1>

      <!-- Month and Year Display -->
      <div class="calendar-header">
        <h2 class="month-year">
          {{ currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
        </h2>
      </div>

      <!-- Days of the week header -->
      <div class="week-header">
        <div v-for="day in weekDays" :key="day" class="week-day">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <div
          v-for="(day, index) in days"
          :key="index"
          class="calendar-cell"
          :class="{ 'not-current-month': day.notCurrentMonth }"
          @click="openAddTaskDialog(day)"
        >
          <div class="date-label">{{ day.date.getDate() }}</div>
          <ul class="task-list">
            <li v-for="(task, i) in day.tasks" :key="i" class="task-item">
              {{ task.name }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Navigation Buttons -->
      <div class="calendar-navigation">
        <Button
          label="Previous Month"
          icon="pi pi-chevron-left"
          class="p-button-text"
          @click="prevMonth"
        />
        <Button icon="pi pi-chevron-right" class="p-button-text" @click="nextMonth">
          Next Month
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Parent container to center the calendar */
h1,
h2,
div {
  color: white;
}

.calendar-container {
  display: flex;
  justify-content: center; /* Center the calendar horizontally */
  padding: 20px;
}

/* Task calendar styles */
.task-calendar {
  width: 100em; /* Adjust the width percentage or set a fixed width */
  max-width: 1600px; /* Set the maximum width for larger screens */
  padding: 20px;
  background-color: #323232;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  height: 625px;
}

.calendar-cell {
  padding: 10px;
  transition: all 0.2s ease-in-out;
  border: 1px solid #ffffff;
  background-color: #d1dde4;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100px;
}

.calendar-cell:hover {
  transform: scale(1.1);
}

.not-current-month {
  background-color: darkgrey;
}

.date-label {
  font-weight: bold;
  color: black;
  margin-bottom: 5px;
  text-align: right;
  user-select: none;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}

.calendar-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.p-button-text {
  padding: 10px;
  color: #fff;
  border-radius: 10px;
  background-color: #474747;
  transition: all 0.2s ease-in-out;
}

.p-button-text:hover {
  transform: scale(1.05);
  background-color: #8d8c8c !important;
}
</style>
