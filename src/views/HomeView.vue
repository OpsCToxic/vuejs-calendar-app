<template>
  <div class="calendar-container">
    <div class="task-calendar">
      <h1>Task Calendar</h1>

      <!-- Month and Year Display -->
      <div class="calendar-header">
        <h2 class="month-year">{{ currentDate.toLocaleString('default', { month: 'long', year: "numeric" }) }}</h2>
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
          @click="selectDay(day)"
        >
          <div class="date-label">{{ day.date.getDate() }}</div>
          <!-- Task list sorted by time -->
          <ul class="task-list">
            <li
              v-for="(task, i) in sortedTasks(day.tasks)"
              :key="i"
              class="task-item-box"
            >
              {{ task.name }}
              <span class="task-time">{{ formatTime(task.time) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Navigation Buttons -->
      <div class="calendar-navigation">
        <Button
          icon="pi pi-chevron-left"
          class="p-button-text"
          @click="prevMonth"
        >
          Previous Month
        </Button>
        <Button
          icon="pi pi-chevron-right"
          class="p-button-text"
          @click="nextMonth"
        >
          Next Month
        </Button>
      </div>
    </div>

    <!-- Task Dropdown Dialog -->
    <TaskDropdown
      v-model:visible="taskDropdownVisible"
      :tasks="selectedDay?.tasks"
      :selectedDate="selectedDay?.date"
      @createNewTask="openNewTaskDialog"
    />

    <!-- New Task Dialog -->
    <NewTask v-model:visible="taskDialogVisible" :day="selectedDay" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import Button from 'primevue/button';
import TaskDropdown from '@/components/TaskDropdown.vue';
import NewTask from '@/components/NewTask.vue';
import { onMounted } from 'vue';
const taskStore = useTaskStore(); // Use Pinia store

// State Variables
const currentDate = ref(new Date());
const days = ref([]);
const selectedDay = ref(null); // Track the selected day
const taskDialogVisible = ref(false); // Control visibility of the NewTask dialog
const taskDropdownVisible = ref(false); // Control visibility of the TaskDropdown dialog

// Days of the week for the header
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


// Populate the days array with days of the current month and adjacent days
const populateDays = () => {
  const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
  const lastDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);
  const daysArray = [];

  // Calculate the number of days from the previous month to show at the start
  const prevMonthLastDay = new Date(firstDay);
  prevMonthLastDay.setDate(0); // Last day of the previous month
  const prevDaysCount = firstDay.getDay(); // Days to show from the previous month

  // Add days from the previous month
  for (let i = prevDaysCount - 1; i >= 0; i--) {
    const prevMonthDay = new Date(prevMonthLastDay);
    prevMonthDay.setDate(prevMonthLastDay.getDate() - i);
    daysArray.push({
      date: prevMonthDay,
      tasks: taskStore.getTasksForDate(prevMonthDay), // Use Pinia store to get tasks for the day
      notCurrentMonth: true,
    });
  }

  // Add days of the current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
    daysArray.push({
      date: date,
      tasks: taskStore.getTasksForDate(date), // Use Pinia store to get tasks for the day
      notCurrentMonth: false,
    });
  }

  // Calculate the number of days from the next month to fill the last week
  const nextDaysCount = 7 - (daysArray.length % 7);
  if (nextDaysCount < 7) {
    for (let i = 1; i <= nextDaysCount; i++) {
      const nextMonthDay = new Date(lastDay);
      nextMonthDay.setDate(lastDay.getDate() + i);
      daysArray.push({
        date: nextMonthDay,
        tasks: taskStore.getTasksForDate(nextMonthDay), // Use Pinia store to get tasks for the day
        notCurrentMonth: true,
      });
    }
  }

  days.value = daysArray; // Update the days array
};

// Sort tasks by time (for each day)
const sortedTasks = (tasks) => {
  return tasks.sort((a, b) => {
    const timeA = a.time ? new Date(a.time).getTime() : 0;
    const timeB = b.time ? new Date(b.time).getTime() : 0;
    return timeA - timeB;
  });
};

// Format the time for display
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const selectDay = (day) => {
  selectedDay.value = day;
  taskDialogVisible.value = false;
  taskDropdownVisible.value = false;

  if (day.tasks.length === 0) {
    // If no tasks, open the NewTask dialog
    taskDialogVisible.value = true;
  } else {
    // If there are tasks, open the TaskDropdown dialog
    taskDropdownVisible.value = true;
  }
};

const openNewTaskDialog = () => {
  taskDropdownVisible.value = false;
  taskDialogVisible.value = true;
};

// Navigate to the previous month
const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  populateDays();
};

// Navigate to the next month
const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  populateDays();
};

watch(
  () => taskStore.tasksByDate,
  () => {
    populateDays();
  },
  { deep: true }
);

onMounted(() => {
	populateDays();
})
populateDays();
</script>


<style scoped>
.calendar-container {
  display: flex;
  justify-content: center; /* Center the calendar horizontally */
  padding: 20px;
}

.task-calendar {
  width: 100em; /* Adjust the width percentage or set a fixed width */
  max-width: 1600px;
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
  transform: scale(1.05);
}

.not-current-month {
  opacity: 0.5;
}

.date-label {
  font-weight: bold;
  color: black;
  margin-bottom: 5px;
  text-align: right;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item-box {
  background-color: #4bd496;
  color: black;
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.task-time {
  margin-left: 10px;
  font-weight: bold;
}

.calendar-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.p-button-text {
  padding: 10px;
  width: 10em;
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
