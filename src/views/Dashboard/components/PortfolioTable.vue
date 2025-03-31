<template>
  <div class="portfolio-section">
    <h2>Your investment portfolio</h2>
    <div class="skeleton-loader" v-if="isLoading">
      <table class="portfolio-table">
        <thead>
          <tr>
            <th v-for="i in 6" :key="i">
              <div class="skeleton-content"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in 4" :key="row">
            <td v-for="col in 6" :key="col">
              <div class="skeleton-content"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <table class="portfolio-table" v-else>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Qtde</th>
          <th>Purchase Price</th>
          <th>Current Price</th>
          <th>Total Value</th>
          <th>Gain/Loss</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in portfolio" :key="stock.symbol">
          <td>{{ stock.symbol }}</td>
          <td>{{ stock.quantity }}</td>
          <td>$ {{ stock.purchasePrice }}</td>
          <td>$ {{ stock.currentPrice }}</td>
          <td>$ {{ stock.totalValue }}</td>
          <td>R$ {{ stock.gainLoss }} ({{ stock.gainLossPercentage }}%)</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import stocksService from "@/services/stocks";

const portfolio = ref([]);
const isLoading = ref(false);

const fetchPortfolio = async () => {
  isLoading.value = true;

  try {
    const response = await stocksService.getPortfolio();
    portfolio.value = response.data;
  } catch (error) {
    console.error("Error fetching portfolio testando:", error);
    portfolio.value = [];
  }

  isLoading.value = false;
};

onMounted(async () => {
  await fetchPortfolio();
});
</script>

<style lang="scss" scoped>
.portfolio-section {
  margin-top: 2rem;
  .portfolio-table {
    width: 100%;
    border: 1px solid $primary-color;
    border-radius: 0.5rem;
    margin-top: 1rem;

    th {
      text-align: left;
      padding: 1rem;
      color: $primary-color;
      border-bottom: 1px solid $bg-color-dark;
      font-weight: 500;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid $bg-color-dark;
    }
  }
}

.skeleton-loader {
  width: 100%;

  .skeleton-content {
    width: 100%;
    height: 1.5rem;
    background: linear-gradient(90deg, #2c3e50 25%, #34495e 50%, #2c3e50 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  .portfolio-table {
    width: 100%;
    border: 1px solid $primary-color;
    border-radius: 0.5rem;

    th,
    td {
      padding: 1rem;
      border-bottom: 1px solid $bg-color-dark;
    }
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
