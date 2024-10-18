import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage';
import SignupPage from '../components/SignupPage';
import HomePage from '../components/HomePage';
import RefreshLogin from '@/components/RefreshLogin';
import { getCookie } from '../utils/authUtils'; // Import the getCookie utility

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
        next(); // Proceed if token exists
      } else {
        next('/'); // Redirect to landing if not authenticated
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
