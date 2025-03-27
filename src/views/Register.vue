<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Create an <span class="accent">Account</span></h1>

      <form @submit.prevent="handleRegister">
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

        <div class="form-group">
          <label for="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="register-button" :disabled="isLoading">
          {{ isLoading ? "Creating account..." : "Register" }}
        </button>
      </form>

      <div class="login-link">
        <p>
          Already have an account?
          <a href="#" @click.prevent="navigateToLogin">Login here</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import { usePortfolioStore } from "../store/portfolio";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const isLoading = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const portfolioStore = usePortfolioStore();

const handleRegister = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = "Please fill all fields";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    isLoading.value = true;
    error.value = "";

    await authStore.register({
      email: email.value,
      password: password.value,
    });

    portfolioStore.resetPortfolio();

    router.push("/dashboard");
  } catch (err) {
    error.value = "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const navigateToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0a1126;
  padding: 1rem;
}

.register-card {
  background-color: rgba(18, 29, 89, 0.3);
  border: 1px solid rgba(149, 56, 242, 0.3);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.register-card h1 {
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

.register-button {
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

.register-button:hover {
  background-color: #8429e0;
}

.register-button:disabled {
  background-color: rgba(149, 56, 242, 0.5);
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #bab9b9;
}

.login-link a {
  color: #9538f2;
  text-decoration: none;
  margin-left: 0.25rem;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
