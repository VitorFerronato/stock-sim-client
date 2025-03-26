<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login to InvestSim</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="primary-button" :disabled="isLoading">
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <div class="register-link">
        <p>
          Don't have an account?
          <a href="#" @click.prevent="navigateToRegister">Register here</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

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

const navigateToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2d3748;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 1rem;
  font-size: 0.875rem;
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
  width: 100%;
}

.primary-button:hover {
  background-color: #3182ce;
}

.primary-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
}

.register-link a {
  color: #4299e1;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
