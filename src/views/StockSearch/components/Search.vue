<template>
  <div class="search-card">
    <div class="search-form">
      <MvpTextField
        v-model="searchQuery"
        @keyup.enter="searchStocks"
        label="Search for stocks"
        placeholder="Search for stocks"
        style="width: 400px"
      />

      <MvpButton title="Search" :disabled="isLoading" @click="searchStocks" />
    </div>
    <div class="available-balance">
      <p>
        Available balance:
        {{ availableBalance }}
      </p>
    </div>
  </div>
</template>

<script setup>
import MvpButton from "@/components/MvpButton.vue";
import MvpTextField from "@/components/MvpTextField.vue";

import stocksService from "@/services/stocks";

import { ref, defineEmits } from "vue";

const emit = defineEmits(["searchResults"]);

const isLoading = ref(false);
const searchQuery = ref("");

const availableBalance = ref(0);

const searchStocks = async () => {
  isLoading.value = true;

  try {
    const response = await stocksService.getStocks(searchQuery.value);
    emit("searchResults", response.data);
  } catch (error) {
    console.error(error);
  }

  isLoading.value = false;
};
</script>

<style lang="scss" scoped>
.search-card {
  background-color: $bg-color;
  border: 1px solid $primary-color;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;

  .search-form {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
  }

  .available-balance {
    margin-top: 1rem;
  }
}
</style>
