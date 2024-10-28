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
import { logInfo, logWarn, logError } from '@/utils/logger';
import { useUserStore } from '@/stores/userStore';

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
      apiUrl: `${process.env.VUE_APP_API_URL}/login` || 'http://localhost:3000/login',
    };
  },

  setup() {
    const userStore = useUserStore();
    return { userStore };
  },

  methods: {
    /**
     * Handles the login process.
     */
    async login() {
      this.errorMessage = '';
      this.isLoading = true;

      if (!this.username || !this.password) {
        this.errorMessage = 'Please fill in both username and password';
        this.isLoading = false;

        // Log form validation error
        logWarn('Login attempt failed: missing credentials');
        return;
      }

      try {
        // Log that the API call is starting
        logInfo('Sending login request to API');

        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,  // This is not part of the log
            password: this.password,  // Same here
          }),
        });

        // Check if the response is not OK
        if (!response.ok) {
          const errorData = await response.json();
          logError(`Login failed: ${ errorData.message }`);
          throw new Error(errorData.message || 'Login failed');
        }

        // Successful login
        const data = await response.json();
        this.userStore.logIn(this.username, data.token, data.expiresIn);

        // Log successful login as info (no username in log)
        logInfo('User successfully logged in');

        // Redirect user after login
        this.$router.push('/home');

      } catch (error) {
        this.errorMessage = error.message;

        // Log failed login as a warning (no username in log)
        logWarn(`Login failed: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Toggles the visibility of the password input field.
     */
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;

      // Log password visibility toggling action
      logInfo(`Toggled password visibility to ${this.showPassword ? 'visible' : 'hidden'}`);
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
