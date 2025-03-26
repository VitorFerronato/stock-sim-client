<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>

    <div class="welcome-card">
      <h2>Welcome, {{ authStore.user?.name }}</h2>
      <p>Here's your investment summary</p>
    </div>

    <div class="refresh-button-container">
      <button
        @click="refreshPortfolio"
        :disabled="isLoading"
        class="refresh-button"
      >
        {{ isLoading ? "Refreshing..." : "Refresh Portfolio" }}
      </button>
    </div>

    <div class="stats-grid">
      <!-- Total Balance Card -->
      <div class="stat-card">
        <div class="stat-title">Total Balance</div>
        <div class="stat-value">{{ formatCurrency(totalBalance) }}</div>
        <div class="stat-description">Your total portfolio value</div>
      </div>

      <!-- Available Cash Card -->
      <div class="stat-card">
        <div class="stat-title">Available Cash</div>
        <div class="stat-value">
          {{ formatCurrency(portfolioStore.availableBalance) }}
        </div>
        <div class="stat-description">Cash available for investment</div>
      </div>

      <!-- Invested Amount Card -->
      <div class="stat-card">
        <div class="stat-title">Invested Amount</div>
        <div class="stat-value">
          {{ formatCurrency(portfolioStore.totalInvestment) }}
        </div>
        <div class="stat-description">Total amount invested</div>
      </div>

      <!-- Current Portfolio Value Card -->
      <div class="stat-card">
        <div class="stat-title">Portfolio Value</div>
        <div class="stat-value">
          {{ formatCurrency(portfolioStore?.portfolioValue) }}
        </div>
        <div class="stat-description">Current value of your investments</div>
      </div>

      <!-- Gain/Loss Card -->
      <div
        class="stat-card"
        :class="{
          gain: portfolioStore.totalGainLoss > 0,
          loss: portfolioStore.totalGainLoss < 0,
        }"
      >
        <div class="stat-title">Total Gain/Loss</div>
        <div class="stat-value">
          {{ formatCurrency(portfolioStore.totalGainLoss) }}
        </div>
        <div class="stat-percentage">
          {{ formatPercentage(portfolioStore.totalGainLossPercentage) }}
        </div>
      </div>

      <!-- Stocks Held Card -->
      <div class="stat-card">
        <div class="stat-title">Stocks Held</div>
        <div class="stat-value">{{ portfolioStore.portfolio.length }}</div>
        <div class="stat-description">
          Number of different stocks in portfolio
        </div>
      </div>
    </div>

    <div class="section-title">
      <h2>Your Investment Portfolio</h2>
    </div>

    <div v-if="portfolioStore.portfolio.length === 0" class="empty-portfolio">
      <p>You don't have any investments yet.</p>
      <router-link to="/search" class="primary-button"
        >Start Investing</router-link
      >
    </div>

    <div v-else class="portfolio-table-container">
      <table class="portfolio-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Purchase Price</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in portfolioStore.portfolio" :key="stock.symbol">
            <td>{{ stock.symbol }}</td>
            <td>{{ stock.quantity }}</td>
            <td>{{ formatCurrency(stock.purchasePrice) }}</td>
            <td>{{ formatCurrency(stock.currentPrice) }}</td>
            <td>{{ formatCurrency(stock.currentPrice * stock.quantity) }}</td>
            <td
              :class="{
                'gain-text': stock.currentPrice > stock.purchasePrice,
                'loss-text': stock.currentPrice < stock.purchasePrice,
              }"
            >
              {{
                formatCurrency(
                  (stock.currentPrice - stock.purchasePrice) * stock.quantity
                )
              }}
              ({{
                formatPercentage(
                  ((stock.currentPrice - stock.purchasePrice) /
                    stock.purchasePrice) *
                    100
                )
              }})
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="action-buttons">
      <router-link to="/search" class="primary-button">Buy Stocks</router-link>
      <router-link to="/portfolio" class="secondary-button"
        >Manage Portfolio</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { usePortfolioStore } from "../store/portfolio";
import { useAuthStore } from "../store/auth";

const portfolioStore = usePortfolioStore();
const authStore = useAuthStore();
const isLoading = ref(false);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

const totalBalance = computed(() => {
  return portfolioStore.availableBalance + portfolioStore?.portfolioValue;
});

const refreshPortfolio = async () => {
  isLoading.value = true;
  await portfolioStore.updateStockPrices();
  isLoading.value = false;
};

onMounted(async () => {
  await refreshPortfolio();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.welcome-card {
  background-color: #ebf8ff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #4299e1;
}

.welcome-card h2 {
  color: #2b6cb0;
  margin-bottom: 0.5rem;
}

.welcome-card p {
  color: #4a5568;
}

.refresh-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.refresh-button {
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-button:hover {
  background-color: #3182ce;
}

.refresh-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.stat-card.gain {
  border-left: 4px solid #48bb78;
}

.stat-card.loss {
  border-left: 4px solid #f56565;
}

.stat-title {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.stat-description {
  font-size: 0.875rem;
  color: #718096;
}

.stat-percentage {
  font-size: 0.875rem;
  color: #718096;
}

.section-title {
  margin: 2rem 0 1rem;
}

.section-title h2 {
  color: #2d3748;
  font-size: 1.5rem;
}

.empty-portfolio {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.empty-portfolio p {
  margin-bottom: 1rem;
  color: #4a5568;
}

.portfolio-table-container {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.portfolio-table {
  width: 100%;
  border-collapse: collapse;
}

.portfolio-table th,
.portfolio-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.portfolio-table th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

.portfolio-table tr:hover {
  background-color: #f7fafc;
}

.gain-text {
  color: #48bb78;
}

.loss-text {
  color: #f56565;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-button {
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.primary-button:hover {
  background-color: #3182ce;
}

.secondary-button {
  background-color: #2d3748;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.secondary-button:hover {
  background-color: #1a202c;
}
</style>
