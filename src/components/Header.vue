<template>
  <header class="header">
    <router-link to="/" class="logo">
      <span class="logo-text">Stock<span class="logo-accent">Sim</span></span>
    </router-link>

    <div v-if="!authStore.isAuthenticated" class="header-buttons">
      <router-link to="/register">
        <MvpButton title="Register" outlined />
      </router-link>

      <router-link to="/login">
        <MvpButton title="Login" />
      </router-link>
    </div>

    <div v-else class="header-buttons">
      <MvpButton title="Logout" @click="logout" outlined />
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import MvpButton from "./MvpButton.vue";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped lang="scss">
.header {
  background-color: $bg-color;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.logo {
  text-decoration: none;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.logo-accent {
  color: $primary-color;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-button {
  background-color: rgba(124, 58, 237, 0.1);
  border: 1px solid $primary-color;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-button:hover {
  background-color: rgba(124, 58, 237, 0.2);
}

.user-icon {
  width: 20px;
  height: 20px;
  color: $primary-color;
}

.header-buttons {
  display: flex;
  gap: 1rem;
}
</style>
