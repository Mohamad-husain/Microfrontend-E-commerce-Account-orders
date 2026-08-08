import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  { path: "/", redirect: { name: "account-profile" } },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/pages/RegisterPage.vue"),
  },
  { path: "/account", redirect: { name: "account-profile" } },
  {
    path: "/account/profile",
    name: "account-profile",
    component: () => import("@/pages/PersonalInfoPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/account/orders",
    name: "order-history",
    component: () => import("@/pages/OrderHistoryPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/account/wishlist",
    name: "account-wishlist",
    component: () => import("@/pages/WishlistPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/account/reviews",
    name: "account-reviews",
    component: () => import("@/pages/ReviewsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "account-profile" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  auth.initialize();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if ((to.name === "login" || to.name === "register") && auth.isAuthenticated) {
    return { name: "account-profile" };
  }

  return true;
});

export default router;
