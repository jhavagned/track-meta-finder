import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage';
import SignupPage from '../components/SignupPage';
import HomePage from '../components/HomePage';
import RefreshLogin from '@/components/RefreshLogin';
import { getCookie } from '../utils/authUtils'; // Import the getCookie utility
import { logToServer } from '../utils/logger'; // Adjust the path as needed for your logging utility

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: RefreshLogin,
  },
  {
    path: '/home',
    name: 'Dashboard',
    component: HomePage,
    beforeEnter: (to, from, next) => {
      const token = getCookie('authToken'); // Check for the cookie
      if (token) {
        logToServer(`User attempted to access the Dashboard and was authenticated.`, { level: 'info' });
        next(); // Proceed if token exists
      } else {
        logToServer(`User attempted to access the Dashboard but was not authenticated.`, { level: 'warn' });
        next('/'); // Redirect to landing if not authenticated
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Log navigation attempts
router.beforeEach((to, from) => {
  logToServer(`Navigating from ${from.name} to ${to.name}.`, { level: 'info' });
});

export default router;
