// main.js

/**
 * Main entry point for the Vue.js application.
 * - Initializes the app, sets up Pinia for state management, and configures routing.
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia for state management
import App from './App.vue';
import router from './router'; // Import Vue Router

// Import the pinia-plugin-persistedstate to persist Pinia state
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Create the Vue app instance
const app = createApp(App);

// Create a Pinia instance and register the persisted state plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Add state persistence plugin

// Use Pinia for state management in the Vue app
app.use(pinia);

// Add Vue Router to the app
app.use(router);

// Mount the app to the #app element in the DOM
app.mount('#app');
