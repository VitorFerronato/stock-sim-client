<template>
  <div class="app-container">
    <header>
      <nav class="navbar">
        <div class="logo">
          <router-link to="/">StockSim</router-link>
        </div>

        <div class="nav-links">
          <template v-if="authStore.isLoggedIn">
            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/portfolio">Portfolio</router-link>
            <router-link to="/transactions">Transactions</router-link>
            <router-link to="/search">Search Stocks</router-link>
            <a href="#" @click.prevent="logout">Logout</a>
          </template>

          <template v-else>
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
          </template>
        </div>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./store/auth";
import { usePortfolioStore } from "./store/portfolio";

const authStore = useAuthStore();
const portfolioStore = usePortfolioStore();
const router = useRouter();

onMounted(() => {
  authStore.initializeFromLocalStorage();
  portfolioStore.loadFromLocalStorage();
});

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a202c;
  color: white;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: #2d3748;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #1a202c;
  color: white;
}
</style>
