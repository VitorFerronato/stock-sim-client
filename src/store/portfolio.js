import { defineStore } from "pinia";
import { stockApi } from "../api/stockApi";

export const usePortfolioStore = defineStore("portfolio", {
  state: () => ({
    balance: 100000,
    portfolio: [],
    transactions: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    totalInvestment: (state) => {
      return state.portfolio.reduce((total, stock) => {
        return total + stock.purchasePrice * stock.quantity;
      }, 0);
    },

    availableBalance: (state) => {
      return state.balance;
    },

    portfolioValue: (state) => {
      return state.portfolio.reduce((total, stock) => {
        return total + stock.currentPrice * stock.quantity;
      }, 0);
    },

    totalGainLoss: (state, getters) => {
      return getters?.portfolioValue - getters?.totalInvestment;
    },

    totalGainLossPercentage: (state, getters) => {
      if (getters?.totalInvestment === 0) return 0;
      return (getters?.totalGainLoss / getters?.totalInvestment) * 100;
    },
  },

  actions: {
    async buyStock(symbol, quantity, price) {
      try {
        this.isLoading = true;

        const totalCost = price * quantity;

        if (totalCost > this.balance) {
          throw new Error("Insufficient balance");
        }

        const existingStockIndex = this.portfolio.findIndex(
          (stock) => stock.symbol === symbol
        );

        if (existingStockIndex >= 0) {
          const existingStock = this.portfolio[existingStockIndex];
          const newQuantity = existingStock.quantity + quantity;
          const newAvgPrice =
            (existingStock.purchasePrice * existingStock.quantity + totalCost) /
            newQuantity;

          this.portfolio[existingStockIndex] = {
            ...existingStock,
            quantity: newQuantity,
            purchasePrice: newAvgPrice,
            currentPrice: price,
          };
        } else {
          this.portfolio.push({
            symbol,
            quantity,
            purchasePrice: price,
            currentPrice: price,
            purchaseDate: new Date().toISOString(),
          });
        }

        this.transactions.push({
          type: "BUY",
          symbol,
          quantity,
          price,
          totalAmount: totalCost,
          date: new Date().toISOString(),
        });

        this.balance -= totalCost;

        this.saveToLocalStorage();

        return {
          success: true,
          message: `Successfully purchased ${quantity} shares of ${symbol}`,
        };
      } catch (error) {
        this.error = error.message;
        return {
          success: false,
          message: error.message,
        };
      } finally {
        this.isLoading = false;
      }
    },

    async sellStock(symbol, quantity, price) {
      try {
        this.isLoading = true;

        const stockIndex = this.portfolio.findIndex(
          (stock) => stock.symbol === symbol
        );

        if (stockIndex < 0) {
          throw new Error("Stock not found in portfolio");
        }

        const stock = this.portfolio[stockIndex];

        if (quantity > stock.quantity) {
          throw new Error("Not enough shares to sell");
        }

        const totalAmount = price * quantity;

        if (quantity === stock.quantity) {
          this.portfolio.splice(stockIndex, 1);
        } else {
          this.portfolio[stockIndex] = {
            ...stock,
            quantity: stock.quantity - quantity,
            currentPrice: price,
          };
        }

        this.transactions.push({
          type: "SELL",
          symbol,
          quantity,
          price,
          totalAmount,
          date: new Date().toISOString(),
        });

        this.balance += totalAmount;

        this.saveToLocalStorage();

        return {
          success: true,
          message: `Successfully sold ${quantity} shares of ${symbol}`,
        };
      } catch (error) {
        this.error = error.message;
        return {
          success: false,
          message: error.message,
        };
      } finally {
        this.isLoading = false;
      }
    },

    async updateStockPrices() {
      try {
        this.isLoading = true;

        for (let i = 0; i < this.portfolio.length; i++) {
          const stock = this.portfolio[i];
          const response = await stockApi.getQuote(stock.symbol);

          if (response && response["Global Quote"]) {
            const quote = response["Global Quote"];
            const currentPrice = parseFloat(quote["05. price"]);

            this.portfolio[i] = {
              ...stock,
              currentPrice,
            };
          }
        }

        this.saveToLocalStorage();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    resetPortfolio() {
      this.balance = 100000;
      this.portfolio = [];
      this.transactions = [];
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem("portfolio", JSON.stringify(this.portfolio));
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
      localStorage.setItem("balance", this.balance.toString());
    },

    loadFromLocalStorage() {
      const portfolio = localStorage.getItem("portfolio");
      const transactions = localStorage.getItem("transactions");
      const balance = localStorage.getItem("balance");

      if (portfolio) {
        this.portfolio = JSON.parse(portfolio);
      }

      if (transactions) {
        this.transactions = JSON.parse(transactions);
      }

      if (balance) {
        this.balance = parseFloat(balance);
      }
    },
  },
});
