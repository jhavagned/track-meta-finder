<template>
  <div id="app">
    <router-view></router-view> <!-- Renders routed components here -->

    <!-- Modal Component -->
    <AuthNotification />
  </div>
</template>

<script>
  /**
   * App.vue
   * The root component of the Vue application.
   * - Renders routed components dynamically using `router-view`.
   * - Displays an authentication notification modal (`AuthNotification`).
   */
  import AuthNotification from '@/components/AuthNotification.vue';
  
  export default {
    name: 'App',
    components: { 
      AuthNotification, // Register the modal component for session notifications
    },
  };
</script>

<style>
  /* Global styles */
  body {
    background-color: #e0e7f1;  /* Light, calming background color */
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden; 
    font-family: Arial, sans-serif; /* Default font for readability */
  }
</style>
