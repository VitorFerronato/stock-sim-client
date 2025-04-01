<template>
  <div class="transactions-container">
    <h1>Transaction History</h1>

    <div v-if="!transactions.length" class="empty-transactions">
      <p>You don't have any transactions yet.</p>
      <router-link to="/search" class="primary-button"
        >Start Investing</router-link
      >
    </div>

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
          <tr v-for="(transaction, index) in transactions" :key="index">
            <td>{{ transaction.date }}</td>
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
            <td>{{ transaction.purchasePrice }}</td>
            <td>{{ transaction.totalAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions">
      <router-link to="/dashboard">
        <MvpButton title="Back to dashboard" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import MvpButton from "../components/MvpButton.vue";

import stocksService from "../services/stocks";

import { ref, onMounted } from "vue";

const isLoading = ref(false);
const transactions = ref([]);

const fetchTransactions = async () => {
  isLoading.value = true;

  try {
    const response = await stocksService.getTransactions();
    transactions.value = response?.data ?? [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }

  isLoading.value = false;
};

onMounted(() => {
  fetchTransactions();
});
</script>

<style lang="scss" scoped>
.transactions-container {
  padding: 2rem;
  background-color: $bg-color;
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
  background-color: $bg-color-dark;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.empty-transactions p {
  margin-bottom: 1rem;
  color: $white-color-light;
}

.transactions-content {
  border: 1px solid $primary-color;
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
  color: $primary-color;
  font-weight: normal;
  border-bottom: 1px solid $bg-color-dark;
}

.transactions-table td {
  padding: 1rem;
  color: white;
  border-bottom: 1px solid $bg-color-dark;
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

@media (max-width: 768px) {
  .transactions-content {
    overflow-x: auto;
  }

  .transactions-table {
    min-width: 800px;
  }
}

.skeleton-loader {
  width: 100%;
  margin-bottom: 2rem;

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
</style>
