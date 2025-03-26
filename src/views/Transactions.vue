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
            <th>Qtde</th>
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
      <button @click="$router.push('/dashboard')" class="back-button">
        Back to dashboard
      </button>
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
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>

<style scoped>
.transactions-container {
  padding: 2rem;
  background-color: #0a0d1c;
  min-height: 100vh;
  color: white;
}

h1 {
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
  font-weight: normal;
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
  background-color: #151933;
  border: 1px solid #7c3aed;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  text-align: left;
  padding: 1rem;
  color: #8888a0;
  font-weight: normal;
  border-bottom: 1px solid #2a2f4c;
}

.transactions-table td {
  padding: 1rem;
  color: white;
  border-bottom: 1px solid #2a2f4c;
}

.transaction-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.transaction-type.buy {
  background-color: #166534;
  color: white;
}

.transaction-type.sell {
  background-color: #991b1b;
  color: white;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.back-button {
  background-color: #7c3aed;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.back-button:hover {
  background-color: #6d28d9;
}

@media (max-width: 768px) {
  .transactions-content {
    overflow-x: auto;
  }

  .transactions-table {
    min-width: 800px;
  }
}
</style>
