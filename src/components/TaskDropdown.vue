<template>
  <Dialog header="Tasks" v-model:visible="localVisible" modal @hide="closeDropdown">
    <div v-if="tasks.length > 0" class="task-dropdown">
      <h3>Tasks for {{ formattedDate }}</h3>
      <ul class="task-list">
        <li v-for="(task, index) in tasks" :key="index" class="task-item">
          <div class="task-header" @click="toggleTask(index)">
            <span>{{ task.name }} - {{ formatTime(task.time) }}</span>
            <i :class="{'pi pi-chevron-down': !taskExpanded[index], 'pi pi-chevron-up': taskExpanded[index]}"></i>
          </div>
          <div v-if="taskExpanded[index]" class="task-details">
            <p>{{ task.description || 'No description provided' }}</p>
          </div>
        </li>
      </ul>
      <!-- Button to Create New Task -->
      <Button label="Add New Task" icon="pi pi-plus" class="p-button-sm" @click="createNewTask" />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { format } from 'date-fns';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [], // Default to an empty array if no tasks are provided
  },
  selectedDate: {
    type: Date,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'createNewTask']); // Emit events to close the dropdown and open task creation

const taskExpanded = ref([]);  // Track which task is expanded
const localVisible = ref(props.visible); // Use local visibility state

watch(
  () => props.tasks, // Watch for changes in tasks prop
  (newTasks) => {
    if (newTasks && Array.isArray(newTasks)) {
      taskExpanded.value = newTasks.map(() => false);
    } else {
      taskExpanded.value = []; // If newTasks is undefined or not an array, reset taskExpanded
    }
  },
  { immediate: true } // Run immediately to initialize taskExpanded on component mount
);
// Sync local visible state with the prop
watch(() => props.visible, (newValue) => {
  localVisible.value = newValue;
});

// Toggle the expanded state of a task
const toggleTask = (index) => {
  taskExpanded.value[index] = !taskExpanded.value[index];
};

// Format the task time for display
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format the selected date
const formattedDate = computed(() => format(props.selectedDate, 'MMMM d, yyyy'));

// Close the dropdown dialog
const closeDropdown = () => {
  emit('update:visible', false); // Close the dropdown
};

// Emit event to create a new task
const createNewTask = () => {
  closeDropdown(); // Close task dropdown
  emit('createNewTask'); // Emit to open task creation dialog
};
</script>

<style scoped>
.task-dropdown {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  margin-bottom: 1rem;
}

.task-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  background-color: #e3f2fd;
  padding: 10px;
  border-radius: 4px;
}

.task-header:hover {
  background-color: #d1e7f5;
}

.task-details {
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f1f1f1;
}

.p-button-sm {
  margin-top: 10px;
}
</style>
