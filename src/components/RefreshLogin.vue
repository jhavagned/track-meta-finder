<template>
    <div class="d-flex align-items-center min-vh-100">
      <div class="container text-center">
        <div class="login-box">
          <header class="text-center py-4">
            <i class="bi bi-clock-history icon-container"></i>
            <h2>{{ message }}</h2>
          </header>
  
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="username">Username:</label>
              <input
                type="text"
                id="username"
                v-model="username"
                class="form-control"
                aria-label="Username"
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
                  aria-label="Password"
                  required
                />
                <button type="button" class="show-password" @click="togglePasswordVisibility">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading">Logging in...</span>
              <span v-else>Log In</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useUserStore } from '@/stores/userStore';
  
  export default {
    data() {
      return {
        message: 'Your session has expired due to inactivity.',
        errorMessage: '',
        username: '',
        password: '',
        showPassword: false,
        isLoading: false,
        apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000/login',
      };
    },
    setup() {
      const userStore = useUserStore();
      return { userStore };
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      async login() {
        this.errorMessage = '';
        this.isLoading = true;
  
        if (!this.username || !this.password) {
          this.errorMessage = 'Please fill in both username and password';
          this.isLoading = false;
          return;
        }
  
        try {
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
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }
  
          const data = await response.json();
          this.userStore.logIn(this.username, data.token);
  
          // Store token in local storage or session storage
          localStorage.setItem('token', data.token);
          this.$router.push('/home');
  
        } catch (error) {
          this.errorMessage = error.message;
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Apply full-page background and fix potential overflow issues */
  html, body {
    background-color: #e0e7f1;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Prevent horizontal overflow */
  }
  
  /* Ensuring full-page flexbox alignment */
  .d-flex {
    min-height: 100vh;
  }
  
  /* Login Box */
  .login-box {
    background-color: #f5f5f5; /* Soft light gray */
    border: 1px solid #d1d1d1; /* Muted gray border */
    color: #333333; /* Dark gray text */
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Softer shadow */
    max-width: 400px;
    margin: auto;
  }
  
  /* Buttons */
  .btn-primary {
    background-color: #5a8dee; /* Muted blue */
    border-color: #5a8dee;
  }
  
  .btn-primary:hover {
    background-color: #4878c2; /* Slightly darker on hover */
    border-color: #4878c2;
  }
  
  /* Input Fields */
  .form-control {
    background-color: #ffffff; /* White input background */
    border: 1px solid #ced4da; /* Light border for input fields */
  }

  .form-control:focus {
  z-index: 1;
}
  
  /* Error Alert */
  .alert {
    margin-top: 20px;
  }
  
  /* General Text */
  h1, label {
    color: #333333; /* Dark gray text for headings */
  }
  
  /* Icon Styling */
  .icon-container {
    font-size: 50px;
    color: #5a8dee;
    margin-bottom: 15px;
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
  </style>
  