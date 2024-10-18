// src/stores/index.js

// Import the createPinia function from Pinia
import { createPinia } from 'pinia';

// Import the user store defined in userStore.js
import { useUserStore } from './userStore';

// Import the persisted state plugin
import piniaPersistedState from 'pinia-plugin-persistedstate';

// Create a new Pinia instance
const pinia = createPinia();

// Use the persisted state plugin
pinia.use(piniaPersistedState);

// Export the Pinia instance and stores for use in your Vue app
export { 
    pinia, 
    useUserStore 
};

/**
 * Documentation:
 * 
 * This module is responsible for setting up and exporting the Pinia store instance
 * as well as any stores defined in the application.
 * 
 * - createPinia(): Initializes a new Pinia store instance.
 * - useUserStore: A reference to the user store, allowing components to access user-related state and actions.
 * - pinia.use(piniaPersistedState): Enables state persistence for all Pinia stores, saving state to localStorage.
 */
