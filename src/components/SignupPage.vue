<template>
  <div class="container text-center mt-5">
    <img src="../assets/images/TMF_Logo3.png" alt="Track Meta Finder Logo" class="logo">
    <h1>Sign Up</h1>
    <p>Create an account to get started.</p>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="loading" class="alert alert-info" role="alert">
      Signing up, please wait...
    </div>

    <form @submit.prevent="signup">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          required
          @blur="validateUsername"
          aria-label="Username"
        />
        <div v-if="usernameError" class="text-danger">{{ usernameError }}</div>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          required
          @blur="validateEmail"
          aria-label="Email"
        />
        <div v-if="emailError" class="text-danger">{{ emailError }}</div>
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
            aria-label="Password"
          />
          <button type="button" class="show-password" @click="togglePasswordVisibility">
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">Sign Up</button>
      <p class="mt-3">Already have an account? <router-link to="/">Log In</router-link></p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
      apiUrl: 'http://localhost:3000/signup',
      showPassword: false,
      loading: false,
      usernameError: '',
      emailError: '',
    };
  },
  methods: {
    async signup() {
      this.errorMessage = '';
      this.usernameError = '';
      this.emailError = '';
      this.loading = true;

      // Validate fields before sending the request
      this.validateUsername();
      this.validateEmail();

      if (this.usernameError || this.emailError) {
        this.loading = false;
        return; // Stop if there are validation errors
      }

      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        const data = await response.json();
        console.log('Signup successful:', data);
        // Optionally store token if returned and redirect
        this.$router.push('/');
        this.resetForm(); // Reset form fields after successful signup
      } catch (error) {
        this.errorMessage = error.message;
        console.log(this.errorMessage);
      } finally {
        this.loading = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    validateUsername() {
      this.usernameError = this.username.length < 3 ? 'Username must be at least 3 characters long.' : '';
    },

    validateEmail() {
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      this.emailError = !emailPattern.test(this.email) ? 'Please enter a valid email address.' : '';
    },

    resetForm() {
      this.username = '';
      this.email = '';
      this.password = '';
      this.showPassword = false;
      this.usernameError = '';
      this.emailError = '';
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
  max-width: 100px; /* Adjust size as needed */
}
.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding-right: 50px;
  z-index: 1;
  position: relative;
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

.form-control:focus {
  z-index: 1;
}
</style>
