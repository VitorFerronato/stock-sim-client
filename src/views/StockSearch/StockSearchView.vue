<template>
  <div class="stock-search-container">
    <h1>Search and Buy Stocks</h1>
    <Search @searchResults="searchResults = $event" />

    <div class="results-container">
      <SearchResult
        v-if="searchResults.length"
        :searchResults="searchResults"
        @selectStock="selectedStock = $event"
      />
      <StockDetails v-if="selectedStock" :stock="selectedStock" />
    </div>
  </div>
</template>

<script setup>
import Search from "./components/Search.vue";
import SearchResult from "./components/SearchResult.vue";
import StockDetails from "./components/StockDetails.vue";
import { ref } from "vue";

const searchResults = ref([]);
const selectedStock = ref(null);
</script>

<style lang="scss" scoped>
.stock-search-container {
  padding: 2rem;
  background-color: $bg-color;
  min-height: 100vh;
  color: white;

  h1 {
    color: white;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: normal;
  }

  .results-container {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
  }
}
</style>
