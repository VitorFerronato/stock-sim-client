<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login to <span class="accent">Stock</span>Sim</h1>

      <form @submit.prevent="handleLogin">
        <MvpTextfield
          v-model="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <MvpTextfield
          v-model="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <MvpButton
          :isDisabled="isLoading"
          @click="handleLogin"
          title="Login"
          style="width: 100%"
        />
      </form>

      <div class="register-link">
        <p>
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import MvpTextfield from "../components/MvpTextfield.vue";
import MvpButton from "../components/MvpButton.vue";
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Please enter both email and password";
    return;
  }

  try {
    isLoading.value = true;
    error.value = "";

    await authStore.login({
      email: email.value,
      password: password.value,
    });

    router.push("/dashboard");
  } catch (err) {
    error.value = "Invalid email or password";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $bg-color;
  padding: 1rem;
}

.login-card {
  border: 1px solid rgba(149, 56, 242, 0.3);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.login-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 500;
}

.accent {
  color: $primary-color;
}

.error-message {
  color: #ff4d4d;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: $white-color-light;
}

.register-link a {
  color: $primary-color;
  text-decoration: none;
  margin-left: 0.25rem;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
