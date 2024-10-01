<template>
    
    <!-- Month and Year Display -->
    <div class="calendar-header">
        <h2 class="month-year">{{ currentDate.toLocaleString('default', { month: 'long', year: "numeric" }) }}</h2>
    </div>

    <!-- basic listing of days -->
    <!-- <div>
      <ul >
        <li v-for="(day, index) in days" :key="day.date">
          {{ weekDays[day.date.getDay()]}}
          {{ day.date.getDate() }} 
           
        </li>
      </ul>
    </div> -->

    <!-- attempt to list days with accordian drop down  -->
    <!-- TODO: itter through tasks inside accordianContent -->
    <!-- TODO: add the add/delete component inside -->
    <div class="card">
        <Accordion value="0">
            <AccordionPanel v-for="(day, index) in days"
             :key="String(day.date)" 
             :value="String(index)">
                <AccordionHeader>
                  {{ weekDays[day.date.getDay()]}}
                  {{ day.date.getDate() }} 
                </AccordionHeader>
                <AccordionContent>
                    <p class="m-0">test</p>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
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
  </template>
  
  <script setup>
  import { ref, watch  } from 'vue';
  import { useTaskStore } from '../stores/taskStore';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import NewTask from '@/components/NewTask.vue';
  
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';
  
  const taskStore = useTaskStore();
  // State Variables
  const currentDate = ref(new Date());
  const days = ref([]);
  const taskDialog = ref(false);
  const selectedDay = ref(null); // Track the selected day
  
  // Days of the week for the header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Utility function to get the first day of the month
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  
  // Utility function to get the last day of the month
  const getLastDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // Populate the days array with days of the current month and adjacent days
  const populateDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate.value);
    const lastDay = getLastDayOfMonth(currentDate.value);
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
        tasks: taskStore.getTasksForDate(prevMonthDay),
        notCurrentMonth: true,
      });
    }
  
    // Add days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
      daysArray.push({
        date: date,
        tasks: taskStore.getTasksForDate(date),
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
          tasks: taskStore.getTasksForDate(nextMonthDay),
          notCurrentMonth: true,
        });
      }
    }
  
    days.value = daysArray;
  };
  
  
  // Open dialog to add or edit a task
  const openAddTaskDialog = (day) => {
    console.log("Day clicked:");
    console.log(day);
    selectedDay.value = day;
    taskDialog.value = true;
    console.log(taskDialog.value);
  };
  
  // Handle saving a task
  const handleSaveTask = (task, index = null) => {
    if (index !== null) {
      // Update existing task
      selectedDay.value.tasks[index] = task;
    } else {
      // Add new task
      selectedDay.value.tasks.push(task);
    }
  };
  
  // Handle deleting a task
  const handleDeleteTask = (index) => {
    selectedDay.value.tasks.splice(index, 1);
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
    () => taskStore.tasks,
    () => {
      populateDays();
    },
    { deep: true }
  );
  // Initialize calendar with the current month
  populateDays();
  </script>

  <style>
  /* TODO: restyle this page so that the things fit good */
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>