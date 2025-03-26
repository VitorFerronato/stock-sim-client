<template>
  <div class="portfolio-container">
    <div class="header-actions">
      <h1>Your Portfolio</h1>
      <button
        @click="refreshPortfolio"
        :disabled="isLoading"
        class="refresh-button"
      >
        {{ isLoading ? "Refreshing..." : "Refresh Prices" }}
      </button>
    </div>

    <div class="portfolio-overview">
      <div class="overview-card">
        <div>
          <h3>Total Invested</h3>
          <p class="value">
            {{ formatCurrency(portfolioStore.totalInvestment) }}
          </p>
        </div>
        <div>
          <h3>Current Value</h3>
          <p class="value">
            {{ formatCurrency(portfolioStore.portfolioValue) }}
          </p>
        </div>
        <div>
          <h3>Total Gain/Loss</h3>
          <p
            class="value"
            :class="{
              'gain-text': portfolioStore.totalGainLoss > 0,
              'loss-text': portfolioStore.totalGainLoss < 0,
            }"
          >
            {{ formatCurrency(portfolioStore.totalGainLoss) }}
            ({{ formatPercentage(portfolioStore.totalGainLossPercentage) }})
          </p>
        </div>
      </div>
    </div>

    <div v-if="portfolioStore.portfolio.length === 0" class="empty-portfolio">
      <p>You don't have any investments yet.</p>
      <router-link to="/search" class="primary-button"
        >Start Investing</router-link
      >
    </div>

    <div v-else class="portfolio-content">
      <div class="portfolio-list">
        <h2>Your Investments</h2>

        <div class="stock-list">
          <div
            v-for="stock in portfolioStore.portfolio"
            :key="stock.symbol"
            class="stock-item"
            :class="{
              selected: selectedStock && selectedStock.symbol === stock.symbol,
            }"
            @click="selectStock(stock)"
          >
            <div class="stock-info">
              <div class="stock-symbol">{{ stock.symbol }}</div>
              <div class="stock-quantity">{{ stock.quantity }} shares</div>
            </div>
            <div class="stock-prices">
              <div class="current-price">
                {{ formatCurrency(stock.currentPrice) }}
              </div>
              <div
                class="price-change"
                :class="{
                  'gain-text': stock.currentPrice > stock.purchasePrice,
                  'loss-text': stock.currentPrice < stock.purchasePrice,
                }"
              >
                {{
                  formatPercentage(
                    ((stock.currentPrice - stock.purchasePrice) /
                      stock.purchasePrice) *
                      100
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stock-detail" v-if="selectedStock">
        <h2>Stock Details</h2>

        <div class="detail-card">
          <div class="detail-header">
            <div class="detail-symbol">{{ selectedStock.symbol }}</div>
          </div>

          <div class="detail-stats">
            <div class="stat-item">
              <span class="stat-label">Quantity Owned</span>
              <span class="stat-value"
                >{{ selectedStock.quantity }} shares</span
              >
            </div>
            <div class="stat-item">
              <span class="stat-label">Purchase Price</span>
              <span class="stat-value">{{
                formatCurrency(selectedStock.purchasePrice)
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Current Price</span>
              <span class="stat-value">{{
                formatCurrency(selectedStock.currentPrice)
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Cost</span>
              <span class="stat-value">{{
                formatCurrency(
                  selectedStock.purchasePrice * selectedStock.quantity
                )
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Current Value</span>
              <span class="stat-value">{{
                formatCurrency(
                  selectedStock.currentPrice * selectedStock.quantity
                )
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Gain/Loss</span>
              <span
                class="stat-value"
                :class="{
                  'gain-text':
                    selectedStock.currentPrice > selectedStock.purchasePrice,
                  'loss-text':
                    selectedStock.currentPrice < selectedStock.purchasePrice,
                }"
              >
                {{
                  formatCurrency(
                    (selectedStock.currentPrice - selectedStock.purchasePrice) *
                      selectedStock.quantity
                  )
                }}
                ({{
                  formatPercentage(
                    ((selectedStock.currentPrice -
                      selectedStock.purchasePrice) /
                      selectedStock.purchasePrice) *
                      100
                  )
                }})
              </span>
            </div>
          </div>

          <div class="sell-form">
            <h3>Sell Shares</h3>

            <div class="form-group">
              <label for="quantity">Quantity to Sell</label>
              <div class="quantity-input">
                <input
                  id="quantity"
                  type="number"
                  v-model.number="quantity"
                  min="1"
                  :max="selectedStock.quantity"
                  step="1"
                />
                <button
                  class="max-button"
                  @click="quantity = selectedStock.quantity"
                >
                  Max
                </button>
              </div>
            </div>

            <div class="expected-return">
              <p>
                Expected Return:
                <strong>{{
                  formatCurrency(selectedStock.currentPrice * quantity)
                }}</strong>
              </p>
            </div>

            <button
              @click="sellStock"
              :disabled="
                isSelling || quantity <= 0 || quantity > selectedStock.quantity
              "
              class="sell-button"
            >
              {{ isSelling ? "Processing..." : "Sell Shares" }}
            </button>

            <div v-if="sellError" class="error-message">
              {{ sellError }}
            </div>

            <div v-if="sellSuccess" class="success-message">
              {{ sellSuccess }}
            </div>
          </div>
        </div>
      </div>

      <div class="no-selection" v-else>
        <p>
          Select a stock from your portfolio to view details and sell shares
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePortfolioStore } from "../store/portfolio";

const portfolioStore = usePortfolioStore();
const selectedStock = ref(null);
const quantity = ref(0);
const sellError = ref("");
const sellSuccess = ref("");
const isLoading = ref(false);
const isSelling = ref(false);

const refreshPortfolio = async () => {
  try {
    isLoading.value = true;
    await portfolioStore.updateStockPrices();
  } catch (error) {
    console.error("Error refreshing portfolio:", error);
  } finally {
    isLoading.value = false;
  }
};

const selectStock = (stock) => {
  selectedStock.value = stock;
  quantity.value = 1;
  sellError.value = "";
  sellSuccess.value = "";
};

const sellStock = async () => {
  if (!selectedStock.value) {
    sellError.value = "Please select a stock first";
    return;
  }

  if (quantity.value <= 0) {
    sellError.value = "Please enter a valid quantity";
    return;
  }

  if (quantity.value > selectedStock.value.quantity) {
    sellError.value = `You only have ${selectedStock.value.quantity} shares of this stock`;
    return;
  }

  try {
    isSelling.value = true;
    sellError.value = "";

    const result = await portfolioStore.sellStock(
      selectedStock.value.symbol,
      quantity.value,
      selectedStock.value.currentPrice
    );

    if (result.success) {
      sellSuccess.value = result.message;
      selectedStock.value = null;
    } else {
      sellError.value = result.message;
    }
  } catch (error) {
    sellError.value = "Error selling stock. Please try again.";
    console.error(error);
  } finally {
    isSelling.value = false;
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

onMounted(async () => {
  await refreshPortfolio();
});
</script>

<style scoped>
.portfolio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: #2d3748;
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

.portfolio-overview {
  margin-bottom: 2rem;
}

.overview-card {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.overview-card h3 {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.overview-card .value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d3748;
}

.empty-portfolio {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
}

.empty-portfolio p {
  margin-bottom: 1rem;
  color: #4a5568;
}

.portfolio-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.portfolio-list h2,
.stock-detail h2 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.stock-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.stock-item:hover {
  background-color: #f7fafc;
}

.stock-item.selected {
  background-color: #ebf8ff;
  border-left: 4px solid #4299e1;
}

.stock-symbol {
  font-weight: bold;
  color: #2d3748;
}

.stock-quantity {
  font-size: 0.875rem;
  color: #4a5568;
}

.current-price {
  text-align: right;
  font-weight: 500;
  color: #2d3748;
}

.price-change {
  font-size: 0.875rem;
  text-align: right;
}

.gain-text {
  color: #48bb78;
}

.loss-text {
  color: #f56565;
}

.detail-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.detail-header {
  margin-bottom: 1.5rem;
}

.detail-symbol {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  padding: 0.5rem;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 500;
  color: #2d3748;
}

.sell-form {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1.5rem;
}

.sell-form h3 {
  margin-bottom: 1rem;
  color: #2d3748;
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

.quantity-input {
  display: flex;
  gap: 0.5rem;
}

.quantity-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.max-button {
  background-color: #2d3748;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.max-button:hover {
  background-color: #1a202c;
}

.expected-return {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.sell-button {
  background-color: #f56565;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.sell-button:hover {
  background-color: #e53e3e;
}

.sell-button:disabled {
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

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 2rem;
  color: #718096;
  height: 100%;
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

@media (max-width: 768px) {
  .portfolio-content {
    grid-template-columns: 1fr;
  }

  .overview-card {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
