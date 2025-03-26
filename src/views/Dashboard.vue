<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="header">
      <h1>Welcome, {{ userName }}!</h1>
      <p class="subtitle">Here's your investment summary</p>
      <button class="refresh-btn" @click="refreshPortfolio">
        <span class="refresh-icon">⟳</span> Refresh portfolio
      </button>
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
      <button class="manage-btn">Manage Portfolio</button>
      <button class="buy-btn">Buy Stocks</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      userName: "Vitor Ferronato",
      totalBalance: 100000.0,
      availableCash: 99160.0,
      investedAmount: 840.0,
      portfolioValue: 840.0,
      totalGainLoss: 25.94,
      gainLossPercentage: 2.35,
      stocksHeld: 2,
      portfolio: [
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
      ],
    };
  },
  methods: {
    formatNumber(value) {
      return value.toFixed(2).replace(".", ",");
    },
    refreshPortfolio() {
      // Implement refresh logic here
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  background-color: #0a0d1c;
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
  color: #8888a0;
}

.refresh-btn {
  position: absolute;
  right: 0;
  top: 0;
  background-color: #7c3aed;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background-color: #151933;
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
  color: #8888a0;
  font-size: 0.9rem;
}

.portfolio-section {
  margin-top: 2rem;
}

.portfolio-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.portfolio-table th {
  text-align: left;
  padding: 1rem;
  color: #8888a0;
  border-bottom: 1px solid #2a2f4c;
}

.portfolio-table td {
  padding: 1rem;
  border-bottom: 1px solid #2a2f4c;
}

.action-buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.manage-btn,
.buy-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.manage-btn {
  background-color: transparent;
  border: 1px solid #7c3aed;
  color: #7c3aed;
}

.buy-btn {
  background-color: #7c3aed;
  border: none;
  color: white;
}
</style>
