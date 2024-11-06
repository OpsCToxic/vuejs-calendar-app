<template>
  <div class="auth-container">
    <h2 class="auth-title" v-if="!showSignUp">Log In</h2>
    <h2 class="auth-title" v-else>Sign Up</h2>

    <form @submit.prevent="showSignUp ? signUp() : signIn()" class="auth-form">
      <InputText
        v-if="showSignUp"
        v-model="signUpUsername"
        placeholder="Username"
        class="auth-input"
      />
      <InputText
        v-else
        v-model="signInUsername"
        placeholder="Username"
        class="auth-input"
      />

      <input
        v-if="showSignUp"
        type="password"
        v-model="signUpPassword"
        placeholder="Password"
        class="auth-input"
      />
      <input
        v-else
        type="password"
        v-model="signInPassword"
        placeholder="Password"
        class="auth-input"
      />

      <Button
        type="submit"
        label="Submit"
        icon="pi pi-check"
        class="auth-button"
      />
      <p class="toggle-text">
        <span v-if="!showSignUp">Don't have an account?</span>
        <span v-else>Already have an account?</span>
        <Button
          :label="showSignUp ? 'Sign In' : 'Sign Up'"
          class="toggle-button p-button-text"
          @click="toggleForm"
        />
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import router from '@/router';
import { useTaskStore } from '../stores/taskStore';

const taskStore = useTaskStore();
const showSignUp = ref(false);

const signUpUsername = ref('');
const signUpPassword = ref('');
const signInUsername = ref('');
const signInPassword = ref('');

const toggleForm = () => {
  showSignUp.value = !showSignUp.value;
};

const signUp = async () => {
  try {
    const response = await axios.post('http://localhost:8080/users/signup', {
      username: signUpUsername.value,
      password: signUpPassword.value,
    });
    alert('Sign-up successful');
    toggleForm(); // Switch back to login form after successful sign-up
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

const signIn = async () => {
  try {
    const response = await axios.post('http://localhost:8080/users/signin', {
      username: signInUsername.value,
      password: signInPassword.value,
    }, {
      withCredentials: true // Include credentials to keep session
    });

    console.log(response);

    // Check if status is 200 for a successful login
    if (response.status === 200) {
      alert('Sign-in successful');

      // Fetch user tasks and store them
      await taskStore.fetchTasks();

      // Navigate to the /home route
      router.push('/home');
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    alert('Invalid credentials');
  }
};
</script>

<style scoped>
/* Container styling for dark mode */
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1e1e1e; /* Dark background */
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Title styling */
.auth-title {
  font-size: 1.8rem;
  color: #80aaff; /* Lighter color for contrast */
  margin-bottom: 1rem;
}

/* Form styling */
.auth-form {
  display: flex;
  flex-direction: column;
}

/* Input styling */
.auth-input {
  margin-bottom: 1rem;
  width: 100%;
  background-color: #2e2e2e; /* Slightly lighter than container */
  color: #ffffff; /* White text for dark background */
  padding: 0.75rem;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  font-size: 1rem;
}

.auth-input::placeholder {
  color: #aaaaaa; /* Light placeholder color */
}

/* Button styling */
.auth-button {
  background-color: #0078d4;
  color: #fff;
  font-weight: bold;
  width: 100%;
  padding: 0.75rem;
  border: none;
  cursor: pointer;
}

.auth-button:hover {
  background-color: #005a9e;
}

/* Toggle text styling */
.toggle-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #bbbbbb;
}

.toggle-button {
  margin-top: 0.5rem;
  color: #80aaff; /* Accent color for toggle */
}
</style>
