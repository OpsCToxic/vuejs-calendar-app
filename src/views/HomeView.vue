<template>
  <div class="calendar-container">
    <div class="task-calendar">
      <h1>Task Calendar</h1>

      <!-- Month and Year Display -->
      <div class="calendar-header">
        <h2 class="month-year">{{ currentMonthYear }}</h2>
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
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text"
                @click.stop="editTask(task, day)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-text"
                @click.stop="deleteTask(task, day)"
              />
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

      <!-- Dialog for adding/editing tasks -->
      <Dialog header="Add/Edit Task" :visible="taskDialog" @hide="closeTaskDialog">
        <div class="p-fluid">
          <div class="p-field">
            <label for="taskName">Task Name</label>
            <InputText id="taskName" v-model="currentTask.name" />
          </div>
        </div>
        <template #footer>
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="closeTaskDialog"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveTask"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

// State Variables
const currentDate = ref(new Date());
const days = ref([]);
const taskDialog = ref(false);
const currentTask = reactive({ name: '', day: null, editing: false });

// Days of the week for the header
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Display the current month and year
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

// Utility function to get the first day of the month
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

// Utility function to get the last day of the month
const getLastDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

// Populate the days array with days of the current month and adjacent days
const populateDays = () => {
  const firstDay = getFirstDayOfMonth(currentDate.value);
  const lastDay = getLastDayOfMonth(currentDate.value);
  const daysArray = [];

  // Fill in days from the previous month
  for (let i = firstDay.getDay(); i > 0; i--) {
    const prevMonthDay = new Date(firstDay);
    prevMonthDay.setDate(firstDay.getDate() - i);
    daysArray.push({ date: prevMonthDay, tasks: [], notCurrentMonth: true });
  }

  // Fill in days for the current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    daysArray.push({
      date: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day),
      tasks: [],
      notCurrentMonth: false,
    });
  }

  // Fill in days for the next month to complete the last week
  const nextMonthDaysToAdd = (7 - (daysArray.length % 7)) % 7;
  for (let i = 1; i <= nextMonthDaysToAdd; i++) {
    const nextMonthDay = new Date(lastDay);
    nextMonthDay.setDate(lastDay.getDate() + i);
    daysArray.push({ date: nextMonthDay, tasks: [], notCurrentMonth: true });
  }

  days.value = daysArray;
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

// Open dialog to add a task
const openAddTaskDialog = (day) => {
  currentTask.name = '';
  currentTask.day = day;
  currentTask.editing = false;
  taskDialog.value = true;
};

// Edit existing task
const editTask = (task, day) => {
  currentTask.name = task.name;
  currentTask.day = day;
  currentTask.editing = true;
  taskDialog.value = true;
};

// Save task to the current day
const saveTask = () => {
  if (currentTask.editing) {
    const existingTask = currentTask.day.tasks.find((t) => t.name === currentTask.name);
    if (existingTask) {
      existingTask.name = currentTask.name;
    }
  } else {
    currentTask.day.tasks.push({ name: currentTask.name });
  }
  taskDialog.value = false;
};

// Delete task
const deleteTask = (task, day) => {
  day.tasks = day.tasks.filter((t) => t !== task);
};

// Close task dialog
const closeTaskDialog = () => {
  taskDialog.value = false;
};

// Initialize calendar with current month
populateDays();
</script>

<style scoped>
/* Parent container to center the calendar */
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
