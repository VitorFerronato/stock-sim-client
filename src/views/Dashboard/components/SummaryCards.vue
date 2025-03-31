<template>
  <div class="summary-grid">
    <div class="summary-card" v-for="item in summaryItems" :key="item.title">
      <h2>{{ item.title }}</h2>
      <div class="skeleton-loader" v-if="isLoading">
        <div class="skeleton-content"></div>
      </div>
      <div class="amount" v-else>$ {{ item.amount }}</div>
      <p class="description">{{ item.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import stocksService from "@/services/stocks";

const isLoading = ref(false);
const summaryItems = ref([]);
const summary_config = [
  {
    key: "availableCash",
    title: "Available Cash",
    description: "Cash available for investment",
  },
  {
    key: "investedAmount",
    title: "Invested Amount",
    description: "Total amount invested",
  },
  {
    key: "portfolioValue",
    title: "Portfolio Value",
    description: "Current value of your investments",
  },
  {
    key: "totalGainLoss",
    title: "Total Gain Loss",
    description: "Total gain or loss from your investments",
  },
  {
    key: "gainLossPercentage",
    title: "Gain Loss Percentage",
    description: "Percentage gain or loss from your investments",
  },
  {
    key: "stocksHeld",
    title: "Stocks Held",
    description: "Number of stocks held",
  },
];

const fetchStocks = async () => {
  isLoading.value = true;

  try {
    const { data } = await stocksService.getSummary();

    summaryItems.value = summary_config.map((config) => ({
      title: config.title,
      amount: data[config.key],
      description: config.description,
    }));
  } catch (error) {
    console.error("Error fetching summary:", error);
    summaryItems.value = [];
  }

  isLoading.value = false;
};

onMounted(() => {
  fetchStocks();
});
</script>

<style lang="scss" scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  .summary-card {
    background-color: $bg-color-dark;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }

  .summary-card h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .amount {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .description {
    color: $white-color-light;
    font-size: 0.9rem;
  }
}

.skeleton-loader {
  width: 50%;
  height: 2rem;
  margin: 0.5rem 0;

  .skeleton-content {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #2c3e50 25%, #34495e 50%, #2c3e50 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
