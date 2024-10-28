// src/stores/userStore.js

import { defineStore } from 'pinia';
import { getCookie, setCookie } from '../utils/authUtils';
import { logToServer } from '../utils/logger';  // Import your logging utility

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isLoggedIn: false,
    showModal: false,
    isSessionExpired: false,  // State to track session expiration
    sessionWarningTimeout: null,  // To store the session warning timeout
    sessionCloseTimeout: null,    // To store the modal auto-close timeout
  }),

  persist: true,  // Enable state persistence

  actions: {
    logIn(token, expires) {
      this.isLoggedIn = true;
      this.isSessionExpired = false;  // Reset on login

      // Create a Date object from the expiration time
      const expirationDate = new Date(expires);

      this.startSession(token, expirationDate);
    },

    startSession(token, expiryDate) {
      setCookie('authToken', token, {
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
        expires: expiryDate,
      });

      // Log the session start
      logToServer(`Session started.`, { level: 'info'});

      this.setSessionExpiryWarning(expiryDate);
    },

    setSessionExpiryWarning(expiryDate) {
      // Clear any existing session warning/close timeouts
      if (this.sessionWarningTimeout) clearTimeout(this.sessionWarningTimeout);
      if (this.sessionCloseTimeout) clearTimeout(this.sessionCloseTimeout);

      const expiryTime = new Date(expiryDate).getTime();
      const currentTime = new Date().getTime();
      const warningTime = expiryTime - currentTime - 60000;  // 1 minute before expiry
      const autoCloseTime = 30000;  // Modal auto-closes after 30 seconds

      if (warningTime > 0) {
        // Set a timeout to show the modal 1 minute before expiry
        this.sessionWarningTimeout = setTimeout(() => {
          this.showModal = true;  // Show the modal 1 minute before expiration
          
          // Log the modal display event
          logToServer(`Session warning modal displayed.`, { level: 'warn' });

          // Set a timeout to auto-close the modal after a certain time if no action is taken
          this.sessionCloseTimeout = setTimeout(() => {
            this.showModal = false;  // Close the modal
            this.endSession();  // Optionally, log out the user
            
            // Log the session end due to timeout
            logToServer(`Session automatically closed due to timeout.`, { level: 'warn' });
          }, autoCloseTime);
        }, warningTime);
      }
    },

    async extendSession() {
      // Clear the modal auto-close timeout when the user extends the session
      if (this.sessionCloseTimeout) {
        clearTimeout(this.sessionCloseTimeout);
        this.sessionCloseTimeout = null;
      }

      // Get refresh token from cookies
      const token = getCookie('authToken');  
      const apiUrl = "http://localhost:3000/refresh-token";
  
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        const data = await response.json();

        // Create a Date object from the new expiry string
        const newExpiryDate = new Date(data.newExpiry); 

        this.startSession(data.newToken, newExpiryDate);  // Restart the session with a new expiry
        this.isSessionExpired = false;
        this.showModal = false;  // Hide the modal

        // Log the session extension
        logToServer(`Session extended.`, { level: 'info' });
      } catch (error) {
        // Log the error during session extension
        logToServer(`Error extending session: ${error.message}`, { level: 'error' });
        this.endSession();  // End session on error
      }
    },

    endSession() {
      // Log the session ending
      logToServer(`Ending session.`, { level: 'info' });

      // Clear any session data
      this.username = '';  // Clear the username
      this.isLoggedIn = false;  // Mark the user as logged out
      this.isSessionExpired = true;  // Mark session as expired

      // Clear the authToken cookie
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Redirect to login page with a sessionExpired query
      window.location.href = '/login?sessionExpired=true';
    },

    logOut() {
      // Log the logout action
      logToServer(`User logged out.`, { level: 'info' });
      this.username = '';  // Clear the username
      this.isLoggedIn = false;
      this.isSessionExpired = false;  // Reset on logout
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/';  // Redirect to home
    },
  },

  getters: {
    isUserLoggedIn(state) {
      return state.isLoggedIn;
    },
  },
});

/**
 * Documentation:
 *
 * This module defines the user store using Pinia for state management related to user authentication.
 * 
 * State Properties:
 * - isLoggedIn: A boolean indicating if the user is logged in.
 * - showModal: Controls the visibility of session expiry warning modal.
 * - isSessionExpired: Indicates whether the user session has expired.
 * - sessionWarningTimeout: Timeout for showing the session expiry warning.
 * - sessionCloseTimeout: Timeout for auto-closing the modal.
 * 
 * Actions:
 * - logIn(token, expires): Logs in the user and starts a session.
 * - startSession(token, expiryDate): Initiates a session and sets session expiration warnings.
 * - setSessionExpiryWarning(expiryDate): Sets up warnings for session expiration.
 * - extendSession(): Refreshes the session using a refresh token.
 * - endSession(): Ends the user session and clears cookies.
 * - logOut(): Logs out the user and clears session data.
 * 
 * Getters:
 * - isUserLoggedIn: Returns whether the user is logged in.
 * 
 * State Persistence:
 * - The `persist: true` option enables state persistence, allowing the store's state to be saved across page reloads.
 */
