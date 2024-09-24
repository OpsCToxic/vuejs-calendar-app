<!-- CalendarPage.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import AOS from 'aos';

// Reactive variables for current month and date calculations
const startDate = ref(dayjs().startOf('month'));
const monthDays = ref([]);

// Initialize AOS animations on component mount
onMounted(() => {
  AOS.init();
  updateCalendarDays(startDate.value);
});

// Function to populate days of the month
function updateCalendarDays(month) {
  const days = [];
  const daysInCurrentMonth = month.daysInMonth();
  for (let i = 0; i < daysInCurrentMonth; i++) {
    const currentDate = month.add(i, 'day');
    days.push({
      date: currentDate.format('D'),
    });
  }
  monthDays.value = days;
}

// Functions to navigate between months
function nextMonth() {
  startDate.value = startDate.value.add(1, 'month');
  updateCalendarDays(startDate.value);
}

function previousMonth() {
  startDate.value = startDate.value.add(-1, 'month');
  updateCalendarDays(startDate.value);
}

// Computed property for current month and year display
const currentMonthAndYear = ref(
  `${startDate.value.format('MMMM')} ${startDate.value.format('YYYY')}`
);
</script>

<template>
  <div class="container" data-aos="zoom-in">
    <h1 class="header-title">Scheduler</h1>
    <div class="navigation">
      <button class="nav-button" @click="previousMonth">Previous Month</button>
      <p class="month-display">{{ currentMonthAndYear }}</p>
      <button class="nav-button" @click="nextMonth">Next Month</button>
    </div>
    <div class="calendar-grid">
      <div v-for="(item, index) in monthDays" :key="index" class="day-card">
        <p>{{ item.date }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure body takes up full height and centers the content */

/* Center the container in the middle of the screen, full viewport width */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centers content vertically within the container */
  width: 100vw; /* Full viewport width */
  padding: 20px;
  background-color: #333;
  color: #f4f4f4;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Optional shadow for depth */
}

/* Title styling */
.header-title {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Navigation section styling */
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

/* Button styling */
.nav-button {
  padding: 10px 20px;
  border: none;
  background-color: #555;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #777;
}

/* Display current month and year */
.month-display {
  font-size: 20px;
}

/* Calendar grid expanded to fill the container */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  width: 100%; /* Ensure the grid takes the full width of the container */
}

/* Day card styling */
.day-card {
  padding: 10px;
  background-color: #6f42c1;
  border-radius: 5px;
  color: #f4f4f4;
  text-align: center;
  min-height: 80px; /* Ensures consistent height for cards */
}

</style>
