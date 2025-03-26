<template>
  <div class="transactions-container">
    <h1>Transaction History</h1>

    <div
      v-if="portfolioStore.transactions.length === 0"
      class="empty-transactions"
    >
      <p>You don't have any transactions yet.</p>
      <router-link to="/search" class="primary-button"
        >Start Investing</router-link
      >
    </div>

    <div v-else class="transactions-content">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in sortedTransactions" :key="index">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>
              <span
                class="transaction-type"
                :class="{
                  buy: transaction.type === 'BUY',
                  sell: transaction.type === 'SELL',
                }"
              >
                {{ transaction.type }}
              </span>
            </td>
            <td>{{ transaction.symbol }}</td>
            <td>{{ transaction.quantity }}</td>
            <td>{{ formatCurrency(transaction.price) }}</td>
            <td>{{ formatCurrency(transaction.totalAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions">
      <router-link to="/dashboard" class="secondary-button"
        >Back to Dashboard</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePortfolioStore } from "../store/portfolio";

const portfolioStore = usePortfolioStore();

const sortedTransactions = computed(() => {
  return [...portfolioStore.transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>

<style scoped>
.transactions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 2rem;
  color: #2d3748;
}

.empty-transactions {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.empty-transactions p {
  margin-bottom: 1rem;
  color: #4a5568;
}

.transactions-content {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th,
.transactions-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.transactions-table th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

.transactions-table tr:hover {
  background-color: #f7fafc;
}

.transaction-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.75rem;
}

.transaction-type.buy {
  background-color: #ebfaf0;
  color: #38a169;
}

.transaction-type.sell {
  background-color: #fef1f1;
  color: #e53e3e;
}

.actions {
  display: flex;
  justify-content: flex-end;
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
