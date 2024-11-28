import { createRouter, createWebHistory } from 'vue-router';
import AdminLogin from '../admin/AdminLogin.vue';
import ProductsPanel from '../admin/ProductsPanel.vue';
import SignIn from '../pages/SignIn.vue';
import Dashboard from '../pages/DashboardPage.vue';
import { PocketBaseService } from '../services/PocketBaseService';

const pb = PocketBaseService.getInstance();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sign-in'
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        if (!pb.isAuthenticated()) {
          next('/sign-in');
        } else {
          next();
        }
      }
    },
    {
      path: '/admin',
      redirect: '/admin/products'
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: ProductsPanel,
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        if (!pb.isAuthenticated() || !pb.isAdmin()) {
          next('/sign-in');
        } else {
          next();
        }
      }
    }
  ]
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!pb.isAuthenticated()) {
      next('/sign-in');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
