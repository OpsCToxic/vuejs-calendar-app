<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { RouterView } from 'vue-router';
import './assets/main.css'; // Ensure your main.css includes full-screen styles

const taskStore = useTaskStore()

onMounted(() => {
	taskStore.fetchTasks()
})
</script>

<style scoped>
/* If you need scoped styles for specific App.vue elements, you can add them here */

</style>
