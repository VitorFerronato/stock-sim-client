<template>
  <button class="button" :class="{ outlined }">
    {{ title }}
  </button>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.button {
  background-color: $primary-color;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: $primary-color-dark;
  }

  &.outlined {
    background-color: transparent;
    border: 1px solid $primary-color;
    color: $primary-color;

    &:hover {
      background-color: $primary-color;
      color: white;
    }
  }
}
</style>
