<template>
  <div class="stock-search-container">
    <h1>Search and Buy Stocks</h1>

    <div class="search-card">
      <div class="search-form">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for a stock symbol or company name"
          @keyup.enter="searchStocks"
        />
        <button
          @click="searchStocks"
          :disabled="isSearching"
          class="search-button"
        >
          {{ isSearching ? "Searching..." : "Search" }}
        </button>
      </div>

      <div v-if="searchError" class="error-message">
        {{ searchError }}
      </div>

      <div class="balance-indicator">
        <p>
          Available Balance:
          <strong>{{ formatCurrency(portfolioStore.availableBalance) }}</strong>
        </p>
      </div>
    </div>

    <div v-if="searchResults.length > 0" class="search-results">
      <h2>Search Results</h2>

      <div class="results-grid">
        <div
          v-for="stock in searchResults"
          :key="stock.symbol"
          class="stock-card"
          @click="selectStock(stock)"
        >
          <div class="stock-symbol">{{ stock.symbol }}</div>
          <div class="stock-name">{{ stock.name }}</div>
          <div class="stock-details">
            <span>{{ stock.type }}</span>
            <span>{{ stock.region }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedStock" class="stock-detail-section">
      <h2>Stock Details</h2>

      <div class="stock-detail-card">
        <div class="stock-header">
          <div>
            <div class="stock-symbol-large">{{ selectedStock.symbol }}</div>
            <div class="stock-name-large">{{ selectedStock.name }}</div>
          </div>
          <div class="stock-price-container">
            <div class="stock-price">
              {{ formatCurrency(selectedStock.price) }}
            </div>
            <div
              class="stock-change"
              :class="{
                positive: selectedStock.change > 0,
                negative: selectedStock.change < 0,
              }"
            >
              {{ selectedStock.change > 0 ? "+" : ""
              }}{{ selectedStock.change.toFixed(2) }} ({{
                selectedStock.change > 0 ? "+" : ""
              }}{{ selectedStock.changePercent.toFixed(2) }}%)
            </div>
          </div>
        </div>

        <div class="trading-info">
          <p>As of {{ selectedStock.latestTradingDay }}</p>
        </div>

        <div class="buy-form">
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              v-model.number="quantity"
              min="1"
              step="1"
            />
          </div>

          <div class="total-cost">
            <p>
              Total Cost: <strong>{{ formatCurrency(totalCost) }}</strong>
            </p>
            <p v-if="!canAfford" class="error-message">Insufficient balance</p>
          </div>

          <button
            @click="buyStock"
            :disabled="isBuying || !canAfford"
            class="buy-button"
          >
            {{ isBuying ? "Processing..." : "Buy Stock" }}
          </button>

          <div v-if="buyError" class="error-message">
            {{ buyError }}
          </div>

          <div v-if="buySuccess" class="success-message">
            {{ buySuccess }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { stockApi } from "../api/stockApi";
import { usePortfolioStore } from "../store/portfolio";

const searchQuery = ref("");
const searchResults = ref([]);
const selectedStock = ref(null);
const isSearching = ref(false);
const searchError = ref("");

const quantity = ref(1);
const buyError = ref("");
const buySuccess = ref("");
const isBuying = ref(false);

const portfolioStore = usePortfolioStore();

const totalCost = computed(() => {
  if (!selectedStock.value) return 0;
  return selectedStock.value.price * quantity.value;
});

const canAfford = computed(() => {
  return totalCost.value <= portfolioStore.availableBalance;
});

const searchStocks = async () => {
  if (!searchQuery.value) {
    searchError.value = "Please enter a search term";
    return;
  }

  try {
    isSearching.value = true;
    searchError.value = "";
    searchResults.value = [];
    selectedStock.value = null;

    const response = await stockApi.searchStocks(searchQuery.value);

    if (response.bestMatches && response.bestMatches.length > 0) {
      searchResults.value = response.bestMatches.map((match) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        type: match["3. type"],
        region: match["4. region"],
      }));
    } else {
      searchError.value = "No results found";
    }
  } catch (error) {
    searchError.value = "Error searching for stocks. Please try again.";
    console.error(error);
  } finally {
    isSearching.value = false;
  }
};

const selectStock = async (stock) => {
  try {
    isSearching.value = true;
    buyError.value = "";
    buySuccess.value = "";

    const quoteResponse = await stockApi.getQuote(stock.symbol);

    if (quoteResponse["Global Quote"]) {
      const quote = quoteResponse["Global Quote"];
      selectedStock.value = {
        ...stock,
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
        latestTradingDay: quote["07. latest trading day"],
      };
      quantity.value = 1;
    } else {
      buyError.value = "Unable to fetch stock price. Please try again.";
      selectedStock.value = null;
    }
  } catch (error) {
    buyError.value = "Error fetching stock data. Please try again.";
    console.error(error);
    selectedStock.value = null;
  } finally {
    isSearching.value = false;
  }
};

const buyStock = async () => {
  if (!selectedStock.value) {
    buyError.value = "Please select a stock first";
    return;
  }

  if (quantity.value <= 0) {
    buyError.value = "Please enter a valid quantity";
    return;
  }

  if (totalCost.value > portfolioStore.availableBalance) {
    buyError.value = "Insufficient balance";
    return;
  }

  try {
    isBuying.value = true;
    buyError.value = "";

    const result = await portfolioStore.buyStock(
      selectedStock.value.symbol,
      quantity.value,
      selectedStock.value.price
    );

    if (result.success) {
      buySuccess.value = result.message;
      quantity.value = 1;
    } else {
      buyError.value = result.message;
    }
  } catch (error) {
    buyError.value = "Error buying stock. Please try again.";
    console.error(error);
  } finally {
    isBuying.value = false;
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>

<style scoped>
.stock-search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2d3748;
}

h2 {
  margin: 2rem 0 1rem;
  color: #2d3748;
}

.search-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-form {
  display: flex;
  gap: 0.5rem;
}

.search-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.search-button {
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #3182ce;
}

.search-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.error-message {
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.success-message {
  color: #48bb78;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.balance-indicator {
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: right;
  color: #4a5568;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.stock-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stock-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #f7fafc;
}

.stock-symbol {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d3748;
}

.stock-name {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stock-details {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
}

.stock-detail-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.stock-symbol-large {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
}

.stock-name-large {
  font-size: 1rem;
  color: #4a5568;
}

.stock-price-container {
  text-align: right;
}

.stock-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
}

.stock-change {
  font-size: 0.875rem;
}

.stock-change.positive {
  color: #48bb78;
}

.stock-change.negative {
  color: #f56565;
}

.trading-info {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.buy-form {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.total-cost {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.buy-button {
  background-color: #48bb78;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.buy-button:hover {
  background-color: #38a169;
}

.buy-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>
