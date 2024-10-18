<template>
  <div class="login-page-bg">
    <!-- Header -->
    <header class="text-center py-4">
      <img src="../assets/images/TMF_Logo3.png" alt="Track Meta Finder Logo" class="logo" />
      <h1>{{ appName }}</h1>
      <p class="lead">{{ tagline }}</p>
    </header>

    <!-- Main content container -->
    <div class="container text-center mt-5">
      <div>
        <!-- Error Message Area -->
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <!-- Login Form -->
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-control"
                required
              />
              <button type="button" class="show-password" @click="togglePasswordVisibility" aria-label="Toggle password visibility">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="isLoading">Log In</button>
          <p class="mt-3">
            Don't have an account? <router-link to="/signup">Sign Up</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';

/**
 * LoginComponent is responsible for user authentication.
 * It allows users to log in using their username and password,
 * manages the display of error messages, and handles the visibility
 * of the password input.
 */
export default {
  data() {
    return {
      appName: "Track Meta Finder",
      tagline: "Elevate Your Sets with Accurate Track Data",
      username: '',
      password: '',
      errorMessage: '',
      showPassword: false,
      isLoading: false,
      apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000/login' // Use environment variable
    };
  },

  setup() {
    const userStore = useUserStore(); // Access the Vuex store
    return { userStore };
  },

  methods: {
    /**
     * Handles the login process by sending the username and password
     * to the server and setting the authentication cookie if successful.
     * Displays error messages for failed login attempts.
     *
     * @async
     * @returns {Promise<void>}
     */
    async login() {
      this.errorMessage = ''; // Clear previous error message
      this.isLoading = true; // Start loading

      // Validate if fields are not empty
      if (!this.username || !this.password) {
        this.errorMessage = 'Please fill in both username and password';
        this.isLoading = false; // Stop loading
        return;
      }

      try {
        // Make API request to the login endpoint
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        // Check if the response is not OK
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        // Parse the JSON response
        const data = await response.json();
        
        this.userStore.logIn(this.username, data.token, data.expiresIn);

        // Redirect to a dashboard or homepage
        this.$router.push('/home');

      } catch (error) {
        // Show error message on failed login
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false; // Stop loading
      }
    },

    /**
     * Toggles the visibility of the password input field.
     * When true, the password is visible; when false, it is hidden.
     */
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Toggle visibility
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.logo {
  max-width: 100%;
  height: auto;
  max-height: 200px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding-right: 50px;
  z-index: 1;
}

.show-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  z-index: 2;
}

.show-password:focus {
  outline: none;
}

.form-control {
  background-color: #ffffff; /* White input background */
  border: 1px solid #ced4da; /* Light border for input fields */
}

.form-control:focus {
  z-index: 1;
}

.alert {
  margin-bottom: 20px;
}

.login-page-bg {
  justify-content: center;
}
</style>
