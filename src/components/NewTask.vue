<template>
  <div>
    <Dialog header="Task Details" v-model:visible="localVisible" modal @hide="closeDialog">
      <div class="p-fluid form-layout">
        <div class="p-field">
          <label for="taskName">Task Name</label>
          <InputText
            id="taskName"
            v-model="taskName"
            type="text"
            placeholder="Enter task name"
            class="p-inputtext-lg"
          />
        </div>

        <div class="p-field">
          <label for="taskTime">Time</label>
          <DatePicker v-model="taskTime" timeOnly hourFormat="12" placeholder="Select time" />
        </div>

        <div class="p-field">
          <label for="taskDescription">Description</label>
          <Textarea
            id="taskDescription"
            v-model="taskDescription"
            rows="3"
            autoResize
            placeholder="Enter task description"
            class="p-inputtext-lg"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Save Task"
          icon="pi pi-check"
          class="p-button-text p-button-lg"
          @click="saveTask"
        />
        <Button
          label="Close"
          icon="pi pi-times"
          class="p-button-text p-button-lg"
          @click="closeDialog"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import axios from "axios";

const props = defineProps({
  day: Object,
  visible: Boolean,
});

const emit = defineEmits(['update:visible']);

const taskStore = useTaskStore(); 

const taskName = ref('');
const taskTime = ref(null);
const taskDescription = ref('');
const selectedDate = ref(null); // Or set it to a default Date

const localVisible = ref(props.visible);

// Watch for changes in the prop and update the local visibility
watch(
  () => props.visible,
  (newValue) => {
    localVisible.value = newValue;
    if (newValue) resetForm();
  }
);

watch(taskTime, (newValue) => {
  console.log("Selected Task Time:", newValue); // Check if taskTime updates
});

const closeDialog = () => {
  emit('update:visible', false);
};

const resetForm = () => {
  taskName.value = '';
  taskTime.value = null;
  taskDescription.value = '';
};



const saveTask = () => {

  if (!taskName.value.trim() || !taskTime.value) {
    console.warn("Task name or time is missing.");
    return;
  }

  // Convert `taskTime` to a string format that the API expects
  const formattedTime = taskTime.value
    ? taskTime.value.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Change to `false` for 24-hour format
      })
    : null;

  const newTask = {
    name: taskName.value,
    date: formattedTime, // Send the formatted time as a string
	time: taskTime.value,
    description: taskDescription.value,
  };

  taskStore.addTask(props.day.date, newTask);

  axios.post("http://localhost:8080/tasks/create", newTask, {
    headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // Include credentials (cookies) with the request
})
  .then(response => {
    console.log('Task updated:', response.data);
  })
  .catch(error => {
    console.error('Error updating task:', error);
  });

  closeDialog();
};

</script>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.p-inputtext-lg {
  width: 100%;
}

.p-button-lg {
  padding: 0.75rem 1.25rem;
}

.p-dialog {
  max-width: 500px;
}

.p-field label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.p-field input,
.p-field textarea,
.p-field .p-calendar {
  width: 100%;
}
</style>
