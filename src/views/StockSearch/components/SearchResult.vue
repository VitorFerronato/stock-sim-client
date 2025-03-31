<template>
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
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

import stocksService from "@/services/stocks";

const props = defineProps(["searchResults"]);

const emit = defineEmits(["selectStock"]);

const selectStock = async (stock) => {
  try {
    const response = await stocksService.getStockPrice(stock.symbol);
    emit("selectStock", response.data);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.results-section {
  width: 450px;
  flex-shrink: 0;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.stock-card {
  width: 100%;
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
</style>
