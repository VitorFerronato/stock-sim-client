<template>
  <div class="stock-details-section">
    <h2>Stock Details</h2>
    <div class="stock-detail-card">
      <div class="stock-header">
        <div class="stock-info">
          <div class="stock-symbol-large">{{ stock.symbol }}</div>
          <div class="stock-name-large">{{ stock.symbol }}</div>
        </div>
        <div class="price-info">
          <div class="current-price">
            {{ stock.price }}
          </div>
          <div class="price-change positive">
            +{{ stock.changePercent }} % (+{{ stock.change }})
          </div>
        </div>
      </div>

      <div class="buy-section">
        <h3>Buy Shares</h3>
        <div class="buy-section-form">
          <MvpTextField
            v-model="quantity"
            label="Quantity"
            placeholder="Ex: 1"
            style="flex: 1"
          />
          <MvpButton
            :disabled="quantity <= 0"
            @click="buyShares"
            title="Buy Shares"
          />
        </div>
        <div class="total-cost">
          <span>Total cost: ${{ stock.price * quantity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MvpTextField from "@/components/MvpTextField.vue";
import MvpButton from "@/components/MvpButton.vue";

import { defineProps, ref } from "vue";

import stocksService from "@/services/stocks";

const props = defineProps(["stock"]);

const quantity = ref(0);

const buyShares = async () => {
  try {
    const request = {
      symbol: props.stock.symbol,
      quantity: quantity.value,
      purchasePrice: props.stock.price,
      currentPrice: props.stock.price,
      totalValue: props.stock.price * quantity.value,
      gainLoss: props.stock.change,
      gainLossPercentage: props.changePercent,
      id: props.stock.id,
    };

    const response = await stocksService.buyShares(request);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.stock-details-section {
  flex: 1;
  min-width: 0;
}

.stock-detail-card {
  flex-grow: 1;
  background-color: $bg-color;
  border: 1px solid $primary-color;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 1rem;

  .stock-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
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

  .buy-section-form {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    width: 50%;
  }

  h3 {
    color: white;
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .total-cost {
    font-size: 0.875rem;
    color: $white-color-light;
    margin: 1rem 0;
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
</style>
