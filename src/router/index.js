import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

const Home = () => import("../views/Home.vue");
const Login = () => import("../views/Login.vue");
const Register = () => import("../views/Register.vue");
const Dashboard = () => import("../views/Dashboard/DashboardView.vue");
const Portfolio = () => import("../views/Portfolio.vue");
const Transactions = () => import("../views/Transactions.vue");
const StockSearch = () => import("../views/StockSearch.vue");

const routes = [
  {
    path: "/",
    redirect: { name: "Dashboard" },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
    meta: { requiresAuth: true },
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: Transactions,
    meta: { requiresAuth: true },
  },
  {
    path: "/search",
    name: "StockSearch",
    component: StockSearch,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: "Login" });
  } else if (to.meta.requiresGuest && isLoggedIn) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
