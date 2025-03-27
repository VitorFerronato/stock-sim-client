<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input :type="type" :placeholder="placeholder" />
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 400;
  color: $white-color-light;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(18, 29, 89, 0.4);
  border: 1px solid rgba(149, 56, 242, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
  color: #fff;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #9538f2;
}

.form-group input::placeholder {
  color: #bab9b9;
  opacity: 0.5;
}
</style>
