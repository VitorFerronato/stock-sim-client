<template>
  <div class="home-container">
    <div class="hero">
      <h1>Welcome to StockSim</h1>
      <h2>Learn investing with zero risk using virtual currency</h2>

      <div class="features">
        <div class="feature-card">
          <h3>Start with R$ 100,000</h3>
          <p>
            Begin your investment journey with a generous amount of virtual
            money
          </p>
        </div>

        <div class="feature-card">
          <h3>Real Market Data</h3>
          <p>Practice with real-time stock prices from actual markets</p>
        </div>

        <div class="feature-card">
          <h3>Track Performance</h3>
          <p>Monitor your portfolio performance and transaction history</p>
        </div>
      </div>

      <div class="cta-buttons">
        <button
          v-if="!authStore.isLoggedIn"
          class="primary-button"
          @click="navigateToRegister"
        >
          Get Started
        </button>
        <button v-else class="secondary-button" @click="navigateToDashboard">
          Go to Dashboard
        </button>
      </div>
    </div>

    <div class="how-it-works">
      <h2>How It Works</h2>

      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Create an Account</h3>
          <p>Sign up to get started with your virtual portfolio</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3>Search Stocks</h3>
          <p>Browse and research stocks to invest in</p>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <h3>Buy & Sell</h3>
          <p>Make trades with your virtual R$ 100,000</p>
        </div>

        <div class="step">
          <div class="step-number">4</div>
          <h3>Track Performance</h3>
          <p>Monitor your gains and losses over time</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const authStore = useAuthStore();

const navigateToRegister = () => {
  router.push("/register");
};

const navigateToDashboard = () => {
  router.push("/dashboard");
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a202c;
}

.hero h2 {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 3rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.cta-buttons {
  margin-top: 2rem;
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
}

.primary-button:hover {
  background-color: #3182ce;
}

.secondary-button {
  background-color: #2d3748;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.secondary-button:hover {
  background-color: #1a202c;
}

.how-it-works {
  padding: 3rem 1rem;
  background-color: #f7fafc;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.how-it-works h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1a202c;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.step {
  text-align: center;
  padding: 1.5rem;
}

.step-number {
  background-color: #4299e1;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-weight: bold;
}

.step h3 {
  margin-bottom: 0.5rem;
  color: #2d3748;
}
</style>
