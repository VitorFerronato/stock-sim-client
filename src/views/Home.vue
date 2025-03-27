<template>
  <div class="home-container">
    <div class="hero">
      <h1>Welcome to Stock Sim</h1>
      <h2>Learn investing with zero risk using virtual currency</h2>

      <div class="features">
        <div class="feature-card">
          <h3>Start with $ 100,000</h3>
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
    </div>

    <div class="how-it-works">
      <h2>How it works?</h2>

      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Create an account</h3>
          <p>Sign up to get started with your virtual portfolio</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3>Search Stocks</h3>
          <p>Browse and research stocks to invest in</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3>Buy & Sell</h3>
          <p>Make trades with your virtual $ 100,000</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3>Track Performance</h3>
          <p>Monitor your gains and losses over time</p>
        </div>
      </div>

      <div class="cta-buttons">
        <router-link v-if="!authStore.isAuthenticated" to="/register">
          <MvpButton title="Get started" />
        </router-link>

        <router-link v-else to="/dashboard">
          <MvpButton title="Go to Dashboard" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../store/auth";
import MvpButton from "../components/MvpButton.vue";
const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
.home-container {
  margin: 0 auto;
  padding: 2rem 122px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: transparent;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.hero {
  text-align: center;
  padding: 2rem 1rem;
}

.hero h1 {
  font-size: 50px;
  font-weight: 500;
  margin-bottom: 1rem;
  color: white;
}

.hero h2 {
  font-size: 24px;
  font-weight: 500;
  color: $white-color-light;
  margin-bottom: 4rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid $primary-color;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.feature-card p {
  color: $white-color-light;
}

.how-it-works {
  padding: 2rem 1rem;
  text-align: center;
}

.how-it-works h2 {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 3rem;
  color: $white-color-light;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.step {
  text-align: center;
}

.step-number {
  background-color: $primary-color;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.step h3 {
  margin-bottom: 1rem;
  color: white;
  font-size: 1.25rem;
}

.step p {
  color: $white-color-light;
}

.get-started-btn {
  background-color: $primary-color;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.get-started-btn:hover {
  background-color: #805ad5;
}

.dashboard-btn {
  background-color: #2d3748;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dashboard-btn:hover {
  background-color: #1a202c;
}
</style>
