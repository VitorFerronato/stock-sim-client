<template>
  <div class="app">
    <Header
      v-if="!route.path.includes('/login') && !route.path.includes('/register')"
    />

    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "./store/auth";
import { usePortfolioStore } from "./store/portfolio";
import Header from "./components/Header.vue";

const authStore = useAuthStore();
const portfolioStore = usePortfolioStore();
const route = useRoute();

onMounted(() => {
  authStore.initializeFromLocalStorage();
  portfolioStore.loadFromLocalStorage();
});
</script>

<style>
.app {
  min-height: 100vh;
  background-color: #0a0d1c;
}
</style>
