<template>
  <div class="portfolio-container">
    <div class="header-actions">
      <h1>Your Portfolio</h1>
      <MvpButton title="Refresh Prices" />
    </div>

    <!-- Portfolio Summary -->
    <div class="portfolio-summary">
      <div class="summary-item">
        <h3>Total Invested</h3>
        <div class="summary-value">
          {{ formatCurrency(portfolioStore.totalInvestment) }}
        </div>
      </div>
      <div class="summary-item">
        <h3>Current Value</h3>
        <div class="summary-value">
          {{ formatCurrency(portfolioStore.portfolioValue) }}
        </div>
      </div>
      <div class="summary-item">
        <h3>Total Gain/Loss</h3>
        <div class="summary-value">
          {{ formatCurrency(portfolioStore.totalGainLoss) }}
          ({{ formatPercentage(portfolioStore.totalGainLossPercentage) }})
        </div>
      </div>
    </div>

    <div class="portfolio-content">
      <!-- Investments List -->
      <div class="investments-section">
        <h2>Your Investments</h2>
        <div class="stock-list">
          <div
            v-for="stock in portfolioStore.portfolio"
            :key="stock.symbol"
            class="stock-item"
            :class="{ selected: selectedStock?.symbol === stock.symbol }"
            @click="selectStock(stock)"
          >
            <div class="stock-main">
              <div class="stock-symbol">{{ stock.symbol }}</div>
              <div class="stock-shares">{{ stock.quantity }} Shares</div>
            </div>
            <div class="stock-price">
              <div class="current-price">
                {{ formatCurrency(stock.currentPrice) }}
              </div>
              <div class="price-change">{{ formatPercentage(0) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Details -->
      <div class="details-section">
        <h2>Stock Details</h2>
        <div class="details-container" v-if="!selectedStock">
          <p class="select-prompt">
            Select a stock from your portfolio to view details and sell shares
          </p>
        </div>
        <div class="stock-detail" v-else>
          <div class="detail-card">
            <h2 class="stock-symbol">{{ selectedStock.symbol }}</h2>

            <div class="details-grid">
              <div class="detail-row">
                <div class="detail-item">
                  <div class="detail-label">Quantity Owned</div>
                  <div class="detail-value">
                    {{ selectedStock.quantity }} Shares
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Purchase Price</div>
                  <div class="detail-value">
                    {{ formatCurrency(selectedStock.purchasePrice) }}
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Current Price</div>
                  <div class="detail-value">
                    {{ formatCurrency(selectedStock.currentPrice) }}
                  </div>
                </div>
              </div>

              <div class="detail-row">
                <div class="detail-item">
                  <div class="detail-label">Total Cost</div>
                  <div class="detail-value">
                    {{
                      formatCurrency(
                        selectedStock.purchasePrice * selectedStock.quantity
                      )
                    }}
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Current Value</div>
                  <div class="detail-value">
                    {{
                      formatCurrency(
                        selectedStock.currentPrice * selectedStock.quantity
                      )
                    }}
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Gain/Loss</div>
                  <div class="detail-value">
                    {{
                      formatCurrency(
                        (selectedStock.currentPrice -
                          selectedStock.purchasePrice) *
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
                  </div>
                </div>
              </div>
            </div>

            <div class="sell-section">
              <h3>Sell Shares</h3>
              <MvpTextfield
                v-model.number="quantity"
                :max="selectedStock.quantity"
                @update:value="quantity = $event"
                label="Quantity to sell"
                type="number"
                min="1"
              />

              <div class="expected-return">
                Expected return:
                {{ formatCurrency(selectedStock.currentPrice * quantity) }}
              </div>
              <MvpButton
                title="Sell Shares"
                :disabled="
                  isSelling ||
                  quantity <= 0 ||
                  quantity > selectedStock.quantity
                "
                @click="sellStock"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePortfolioStore } from "../store/portfolio";
import MvpButton from "../components/MvpButton.vue";
import MvpTextfield from "../components/MvpTextfield.vue";
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

<style lang="scss" scoped>
.portfolio-container {
  padding: 2rem;
  background-color: $bg-color;
  min-height: 100vh;
  color: white;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: white;
  font-size: 2rem;
  font-weight: normal;
}

.portfolio-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  gap: 2rem;
}

.summary-item {
  flex: 1;
}

.summary-item h3 {
  color: $white-color-light;
  font-size: 1.1rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.8rem;
  font-weight: bold;
}

.portfolio-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  .investments-section h2,
  .details-section h2 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .stock-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stock-item {
    border: 1px solid $primary-color;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .stock-main {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stock-symbol {
    font-weight: bold;
  }

  .stock-shares {
    color: $white-color-light;
    font-size: 0.9rem;
  }

  .stock-price {
    text-align: right;
  }
}

.price-change {
  color: $white-color-light;
  font-size: 0.9rem;
}

.details-container {
  border: 1px solid $primary-color;
  border-radius: 0.5rem;
  padding: 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-prompt {
  color: $white-color-light;
  text-align: center;
}

.stock-detail {
  color: white;
}

.detail-card {
  border: 1px solid $primary-color;
  border-radius: 0.5rem;
  padding: 2rem;
}

.stock-symbol {
  font-size: 1.5rem;
  color: white;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  color: $white-color-light;
  font-size: 0.9rem;
}

.detail-value {
  color: white;
  font-size: 1rem;
}

.sell-section {
  border-top: 1px solid $primary-color;
  padding-top: 2rem;
}

.sell-section h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.sell-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.sell-input-group label {
  color: $white-color-light;
  font-size: 0.9rem;
}

.quantity-input {
  background-color: $bg-color;
  border: 1px solid $primary-color;
  border-radius: 0.25rem;
  color: white;
  padding: 0.75rem;
  width: 100%;
  font-size: 1rem;
}

.expected-return {
  color: $white-color-light;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .portfolio-content {
    grid-template-columns: 1fr;
  }

  .portfolio-summary {
    flex-direction: column;
  }
}
</style>
