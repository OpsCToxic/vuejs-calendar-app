<template>
  <div>
    <Dialog header="Task Details" :visible="isDialogVisible" modal @hide="closeDialog">
      <div class="p-fluid">
        <div class="p-field">
          <label for="taskName">Task Name</label>
          <InputText
            id="taskName"
            v-model="taskName"
            placeholder="Enter task name"
            @keyup.enter="saveTask"
          />
        </div>
        <div class="p-field">
          <Button
            label="Save Task"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveTask"
          />
        </div>
      </div>

      <template #footer>
        <Button label="Close" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const taskStore = useTaskStore();

const props = defineProps({
  day: Object, // The day object with date and tasks
  visible: Boolean,
  editingTask: Object, // The task to edit, if any
});

const emit = defineEmits(['update:visible']); // Emit for two-way binding

const taskName = ref('');
const isDialogVisible = ref(props.visible);

// Watch for visibility changes
watch(
  () => props.visible,
  (newValue) => {
    isDialogVisible.value = newValue;
    if (props.editingTask) {
      taskName.value = props.editingTask.name; // Prepopulate the task name if editing
    }
  }
);

const closeDialog = () => {
  emit('update:visible', false);
};

// Save or update a task
const saveTask = () => {
  if (taskName.value.trim() === '') return;

  const newTask = { name: taskName.value };

  if (props.editingTask) {
    // Edit existing task
    taskStore.updateTask(props.day.date, props.editingTask, newTask);
  } else {
    // Add new task
    taskStore.addTask(props.day.date, newTask);
  }

  closeDialog();
};
</script>
