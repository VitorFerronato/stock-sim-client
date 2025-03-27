<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Create an <span class="accent">Account</span></h1>

      <form @submit.prevent="handleRegister">
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

        <MvpTextfield
          v-model="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
        />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <MvpButton
          title="Register"
          :isDisabled="isLoading"
          @click="handleRegister"
          style="width: 100%"
        />
      </form>

      <div class="login-link">
        <p>
          Already have an account?
          <router-link to="/login">Login here</router-link>
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
import MvpTextfield from "../components/MvpTextfield.vue";
import MvpButton from "../components/MvpButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const portfolioStore = usePortfolioStore();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const isLoading = ref(false);

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
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $bg-color;
  padding: 1rem;
}

.register-card {
  border: 1px solid $primary-color;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.register-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: $white-color;
  font-size: 1.5rem;
  font-weight: 500;
}

.accent {
  color: $primary-color;
}

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

.error-message {
  color: #ff4d4d;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: $white-color-light;
}

.login-link a {
  color: $primary-color;
  text-decoration: none;
  margin-left: 0.25rem;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
