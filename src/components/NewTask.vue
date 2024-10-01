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
          <Calendar
            id="taskTime"
            v-model="taskTime"
            timeOnly
            hourFormat="12"
            placeholder="Select time"
            showIcon
            class="p-inputtext-lg"
          />
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
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';

const props = defineProps({
  day: Object,
  visible: Boolean,
});

const emit = defineEmits(['update:visible']);

const taskStore = useTaskStore(); 

const taskName = ref('');
const taskTime = ref(null);
const taskDescription = ref('');

const localVisible = ref(props.visible);

// Watch for changes in the prop and update the local visibility
watch(
  () => props.visible,
  (newValue) => {
    localVisible.value = newValue;
    if (newValue) resetForm();
  }
);

const closeDialog = () => {
  emit('update:visible', false);
};

// Reset form fields
const resetForm = () => {
  taskName.value = '';
  taskTime.value = null;
  taskDescription.value = '';
};

const saveTask = () => {
  if (taskName.value.trim() === '') return;

  const newTask = {
    name: taskName.value,
    time: taskTime.value,
    description: taskDescription.value,
  };

  taskStore.addTask(props.day.date, newTask);

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
