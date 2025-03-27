<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login to <span class="accent">Stock</span>Sim</h1>

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

        <button type="submit" class="login-button" :disabled="isLoading">
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
  min-height: 100vh;
  background-color: #0a1126;
  padding: 1rem;
}

.login-card {
  background-color: rgba(18, 29, 89, 0.3);
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
  color: #9538f2;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 400;
  color: #bab9b9;
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

.error-message {
  color: #ff4d4d;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.login-button {
  background-color: #9538f2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  font-weight: 500;
}

.login-button:hover {
  background-color: #8429e0;
}

.login-button:disabled {
  background-color: rgba(149, 56, 242, 0.5);
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #bab9b9;
}

.register-link a {
  color: #9538f2;
  text-decoration: none;
  margin-left: 0.25rem;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
