<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="header">
      <h1>Welcome, {{ userName }}!</h1>
      <div class="header-buttons">
        <p>Here's your investment summary</p>
        <MvpButton title="Refresh portfolio" />
      </div>
    </div>

    <SummaryCards />

    <PortfolioTable />

    <!-- Action Buttons -->
    <div class="action-buttons">
      <router-link to="/portfolio">
        <MvpButton title="Sell Stocks" outlined />
      </router-link>
      <router-link to="/search">
        <MvpButton title="Buy Stocks" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import MvpButton from "@/components/MvpButton.vue";

import { ref } from "vue";
import { useAuthStore } from "@/store/auth";

import SummaryCards from "./components/SummaryCards.vue";
import PortfolioTable from "./components/PortfolioTable.vue";

const authStore = useAuthStore();

const userName = ref(authStore.user?.email || "");
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 2rem;
  background-color: $bg-color;
  color: white;
  min-height: 100vh;
  .header {
    margin-bottom: 2rem;
    position: relative;

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .header-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;

      p {
        color: $white-color-light;
      }
    }
  }

  .action-buttons {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
}
</style>
