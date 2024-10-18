<template>
  <div class="background">
    <!-- Power Icon Logout Button -->
    <div class="float-right">
      <button 
        v-if="isLoggedIn" 
        class="btn btn-link mt-2 me-3" 
        @click="logOut" 
        aria-label="Logout"> 
        <i class="bi bi-power" style="font-size: 1.5rem; color: #dc3545;"></i>
      </button>
    </div>

    <div class="content">
      <!-- Header -->
      <header class="transparent-header text-white text-center py-4 position-relative">
        <img src="../assets/images/TMF_Logo3.png" alt="Track Meta Finder Logo" class="logo">
        <h1>{{ appName }}</h1>
        <p class="lead">{{ welcomeTagline }}</p>
      </header>

      <!-- Hero Section -->
      <section class="hero text-white text-center py-5">
        <div class="container">
          <input
            type="text"
            class="form-control mb-3"
            placeholder="Enter artist name here..."
            v-model="artistName"
          />
          <input
            type="text"
            class="form-control mb-3"
            placeholder="Enter song title here..."
            v-model="songTitle"
          />
          <button class="btn btn-light" @click="searchSong">Search</button> 
          <p class="mt-3">{{ heroDescription }}</p>
        </div>
      </section>

      <!-- Features Section -->
      <section class="transparent-features text-white text-center py-5">
        <div class="container">
          <h2>Features</h2>
          <div class="row">
            <div class="col-md-4" v-for="(feature, index) in features" :key="index">
              <div class="card mb-4 transparent-card">
                <div class="card-body">
                  <h5 class="card-title">{{ feature.title }}</h5>
                  <p class="card-text">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="transparent-footer text-white text-center py-3">
        <p>&copy; {{ currentYear }} {{ appName }}. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'; // Import ref and computed from Vue
import { useUserStore } from '../stores/userStore'; // Importing the user store from Pinia

export default {
  setup() {
    const userStore = useUserStore(); // Create a user store instance
    const appName = 'Track Metadata Finder'; // Application name displayed in the header
    const artistName = ref(''); // Data property for artist name input
    const songTitle = ref(''); // Data property for song title input
    const heroDescription = 'Find key song details in seconds. Get metadata like title, artist, genre, BPM, and more!'; // Description for hero section

    const features = [ // Features displayed in the features section
      {
        title: 'Fast Searches',
        description: 'Quickly retrieve all the metadata you need for any song.',
      },
      {
        title: 'Accurate Data',
        description: 'Get reliable and up-to-date metadata for your favorite tracks.',
      },
      {
        title: 'User-Friendly',
        description: 'Easy to navigate and intuitive design for all users.',
      },
    ];

    const currentYear = computed(() => new Date().getFullYear()); // Current year for the footer using computed

    // Methods
    const logOut = userStore.logOut; // Mapping logOut action from userStore
    const isLoggedIn = userStore.isLoggedIn; // Check if user is logged in
    const username = userStore.getUsername; // Getting username from userStore

    const searchSong = () => {
      // Method to handle song search
      if (artistName.value.trim() && songTitle.value.trim()) { // Check for non-empty inputs
        // Alert with search details (consider replacing with a better UI feedback)
        alert(`Searching for: ${artistName.value} - ${songTitle.value}`);
      } else {
        alert('Please enter both an artist name and a song title.'); // Prompt user for both fields
      }
    };

    return { 
      appName,
      artistName,
      songTitle,
      heroDescription,
      features,
      currentYear,
      logOut,
      isLoggedIn,
      username,
      searchSong,
      welcomeTagline: computed(() => (isLoggedIn ? `Welcome back, ${username}!` : 'Unlock the Details of Your Track')), // Displays welcome message based on login status
    };
  },
};
</script>

<style scoped>
.background {
  position: relative;
  background-image: url('../assets/images/TMF_Background.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; /* Prevents the background from repeating */
  height: auto; 
  overflow-y: auto; /* Allow vertical scrolling if necessary */
}

.background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Adjust the opacity for the gradient overlay */
  z-index: 1; /* Ensures the overlay is above the background */
}

.content {
  position: relative;
  z-index: 2; /* Ensures content is above the gradient overlay */
}

.logo {
  max-width: 100%;
  height: auto;
  max-height: 200px; /* Sets a maximum height for the logo */
}

.transparent-header,
.transparent-features,
.transparent-footer {
  background-color: transparent !important; /* Ensures these sections are fully transparent */
  border: none; /* Remove any borders */
}

.transparent-card {
  background-color: rgba(255, 255, 255, 0) !important; /* Makes the card background transparent */
  border: none; /* Removes any borders for cards */
}

.btn-link {
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
}
</style>
