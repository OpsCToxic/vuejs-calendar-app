<template>
  <Dialog header="Add/Edit Task" :visible="visible" @hide="closeDialog">
    <div class="p-fluid">
      <div class="p-field">
        <label for="taskName">Task Name</label>
        <InputText id="taskName" v-model="taskName" />
      </div>

      <!-- List existing tasks -->
      <ul class="task-list">
        <li v-for="(task, index) in tasks" :key="index" class="task-item">
          <span>{{ task.name }}</span>
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            @click="editTask(task, index)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger p-button-text"
            @click="deleteTask(index)"
          />
        </li>
      </ul>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text"
        @click="closeDialog"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        class="p-button-text"
        @click="saveTask"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps({
  visible: Boolean,
  tasks: Array,  // List of tasks for the selected day
  day: Object    // The selected day object
});

const emits = defineEmits(['update:visible', 'save', 'delete']);

const taskName = ref('');
const editingIndex = ref(null);

// Watch changes to the dialog visibility and reset task input
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetDialog();
  }
});

// Reset dialog fields when opened or closed
function resetDialog() {
  taskName.value = '';
  editingIndex.value = null;
}

// Save a new or edited task
function saveTask() {
  if (editingIndex.value !== null) {
    // Editing an existing task
    emits('save', { name: taskName.value }, editingIndex.value);
  } else {
    // Adding a new task
    emits('save', { name: taskName.value });
  }
  closeDialog();
}

// Edit an existing task
function editTask(task, index) {
  taskName.value = task.name;
  editingIndex.value = index;
}

// Delete a task
function deleteTask(index) {
  emits('delete', index);
}

// Close the dialog
function closeDialog() {
  emits('update:visible', false);
}
</script>

<style scoped>
.task-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>