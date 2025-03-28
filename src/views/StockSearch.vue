<template>
  <div class="stock-search-container">
    <!-- Header Section -->
    <h1>Search and Buy Stocks</h1>

    <!-- Search Section -->
    <div class="search-card">
      <div class="search-form">
        <MvpTextField
          v-model="searchQuery"
          @keyup.enter="searchStocks"
          label="Search for stocks"
          placeholder="Search for stocks"
          style="width: 400px"
        />

        <MvpButton
          title="Search"
          :disabled="isSearching"
          @click="searchStocks"
          class="search-button"
        />
      </div>
      <div class="balance-indicator">
        <p>
          Available balance:
          {{ formatCurrency(portfolioStore.availableBalance) }}
        </p>
      </div>
    </div>

    <!-- Results Section -->
    <div class="results-container">
      <!-- Left side - Results -->
      <div class="results-section">
        <h2>Results</h2>
        <div class="results-grid">
          <div
            v-for="stock in searchResults"
            :key="stock.symbol"
            class="stock-card"
            @click="selectStock(stock)"
          >
            <div class="stock-symbol">{{ stock.symbol }}</div>
            <div class="stock-name">{{ stock.name }}</div>
            <div class="stock-details">Equity Brazil/sao paulo</div>
          </div>
        </div>
      </div>

      <!-- Right side - Stock Details -->
      <div class="stock-details-section">
        <h2>Stock Details</h2>
        <div class="stock-detail-card">
          <div class="stock-header">
            <div class="stock-info">
              <div class="stock-symbol-large">WEGE3F.SAO</div>
              <div class="stock-name-large">WEGE3F</div>
            </div>
            <div class="price-info">
              <div class="current-price">$ 43,03</div>
              <div class="price-change positive">+0,20 % (+0.43%)</div>
            </div>
          </div>

          <div class="buy-section">
            <h3>Buy Shares</h3>
            <div class="quantity-input">
              <label>Quantity to buy</label>
              <input type="text" placeholder="Ex: 1" />
            </div>
            <div class="total-cost">
              <span>Total cost: $46,96</span>
            </div>
            <button class="buy-shares-button">Buy Shares</button>
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
import MvpTextField from "../components/MvpTextField.vue";
import MvpButton from "../components/MvpButton.vue";

const searchQuery = ref("");
const searchResults = ref([
  { symbol: "WEGE3 F", name: "wege3", type: "equity" },
  { symbol: "WEGE3 F", name: "wege3", type: "equity" },
]);
const selectedStock = ref({
  symbol: "WEGE3 F",
  name: "wege3",
  type: "equity",
  price: 100,
  change: 10,
  changePercent: 10,
  latestTradingDay: "2021-01-01",
});
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

<style lang="scss" scoped>
.stock-search-container {
  padding: 2rem;
  background-color: $bg-color;
  min-height: 100vh;
  color: white;
}

.search-card {
  background-color: $bg-color;
  border: 1px solid $primary-color;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.results-container {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.results-section,
.stock-details-section {
  flex: 1;
}

h1 {
  color: white;
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: normal;
}

.stock-card {
  width: 300px;
  background-color: $bg-color;
  border: 1px solid $primary-color;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: $primary-color;
  }

  .stock-symbol {
    font-size: 1.125rem;
    font-weight: 500;
    color: white;
  }

  .stock-name {
    font-size: 0.875rem;
    color: $white-color-light;
    margin-top: 0.25rem;
  }

  .stock-details {
    font-size: 0.75rem;
    color: $white-color-light;
    margin-top: 0.5rem;
  }
}

.stock-detail-card {
  background-color: $bg-color;
  border: 1px solid $primary-color;
  border-radius: 0.5rem;
  padding: 1.5rem;

  .stock-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .stock-symbol-large {
    font-size: 1.25rem;
    font-weight: 500;
    color: white;
  }

  .stock-name-large {
    font-size: 0.875rem;
    color: $white-color-light;
    margin-top: 0.25rem;
  }

  .price-info {
    text-align: right;

    .current-price {
      font-size: 1.5rem;
      font-weight: 500;
      color: white;
    }

    .price-change {
      font-size: 0.875rem;
      margin-top: 0.25rem;

      &.positive {
        color: #10b981;
      }

      &.negative {
        color: #ef4444;
      }
    }
  }
}

.buy-section {
  background-color: $bg-color;
  border-radius: 0.5rem;
  padding: 1.5rem;

  h3 {
    color: white;
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .quantity-input {
    margin-bottom: 1rem;

    label {
      display: block;
      font-size: 0.875rem;
      color: $white-color-light;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      background-color: $bg-color;
      border: 1px solid $primary-color;
      border-radius: 0.25rem;
      color: white;
      font-size: 1rem;
    }
  }

  .total-cost {
    font-size: 0.875rem;
    color: $white-color-light;
    margin-bottom: 1rem;
  }

  .buy-shares-button {
    width: 100%;
    padding: 0.75rem;
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $primary-color-dark;
    }

    &:disabled {
      background-color: $primary-color-dark;
      cursor: not-allowed;
    }
  }
}
.search-form {
  display: flex;
  gap: 1rem;
  align-items: center;
}
p {
  font-size: 14px;
  margin-top: -1rem;
  color: $white-color-light;
}

.results {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.results-grid {
  display: flex;
  gap: 1rem;
}
</style>
