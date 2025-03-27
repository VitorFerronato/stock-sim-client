<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="header">
      <h1>Welcome, {{ userName }}!</h1>
      <div class="header-buttons">
        <p class="subtitle">Here's your investment summary</p>
        <MvpButton title="Refresh portfolio" />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <h2>Total Balance</h2>
        <div class="amount">$ {{ formatNumber(totalBalance) }}</div>
        <p class="description">Your total portfolio value</p>
      </div>

      <div class="summary-card">
        <h2>Available Cash</h2>
        <div class="amount">$ {{ formatNumber(availableCash) }}</div>
        <p class="description">Cash available for investment</p>
      </div>

      <div class="summary-card">
        <h2>Invested Amount</h2>
        <div class="amount">$ {{ formatNumber(investedAmount) }}</div>
        <p class="description">Total amount invested</p>
      </div>

      <div class="summary-card">
        <h2>Portfolio Value</h2>
        <div class="amount">$ {{ formatNumber(portfolioValue) }}</div>
        <p class="description">Current value of your investments</p>
      </div>

      <div class="summary-card">
        <h2>Total Gain/Loss</h2>
        <div class="amount">$ {{ formatNumber(totalGainLoss) }}</div>
        <p class="description">{{ gainLossPercentage }}%</p>
      </div>

      <div class="summary-card">
        <h2>Stocks Held</h2>
        <div class="amount">{{ stocksHeld }}</div>
        <p class="description">Number of different stocks in portfolio</p>
      </div>
    </div>

    <!-- Portfolio Table -->
    <div class="portfolio-section">
      <h2>Your investment portfolio</h2>
      <table class="portfolio-table">
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
            <td>$ {{ formatNumber(stock.purchasePrice) }}</td>
            <td>$ {{ formatNumber(stock.currentPrice) }}</td>
            <td>$ {{ formatNumber(stock.totalValue) }}</td>
            <td>
              R$ {{ formatNumber(stock.gainLoss) }} ({{
                stock.gainLossPercentage
              }}%)
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
import { ref, computed } from "vue";
import { useAuthStore } from "../store/auth";
import MvpButton from "../components/MvpButton.vue";

const authStore = useAuthStore();

const userName = ref(authStore.user?.email || "");
const portfolio = ref([
  {
    symbol: "PETR4F.SAO",
    quantity: 10,
    purchasePrice: 37.04,
    currentPrice: 37.04,
    totalValue: 370.4,
    gainLoss: 0.0,
    gainLossPercentage: 0.0,
  },
  {
    symbol: "WEGE3F.SAO",
    quantity: 10,
    purchasePrice: 46.96,
    currentPrice: 46.96,
    totalValue: 469.6,
    gainLoss: 0.0,
    gainLossPercentage: 0.0,
  },
]);

const totalBalance = computed(() => 100000.0);
const availableCash = computed(() => 99160.0);
const investedAmount = computed(() => 840.0);
const portfolioValue = computed(() => 840.0);
const totalGainLoss = computed(() => 25.94);
const gainLossPercentage = computed(() => 2.35);
const stocksHeld = computed(() => portfolio.value.length);

const formatNumber = (value) => {
  return value.toFixed(2).replace(".", ",");
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 2rem;
  background-color: $bg-color;
  color: white;
  min-height: 100vh;
}

.header {
  margin-bottom: 2rem;
  position: relative;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: $white-color-light;
}

.header-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

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

.portfolio-section {
  margin-top: 2rem;
}

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

.action-buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
