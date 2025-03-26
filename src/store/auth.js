import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    login(credentials) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.user = {
            id: 1,
            email: credentials.email,
            name: credentials.email.split("@")[0],
          };
          this.isAuthenticated = true;

          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("isAuthenticated", "true");

          resolve(this.user);
        }, 500);
      });
    },

    register(credentials) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.user = {
            id: 1,
            email: credentials.email,
            name: credentials.email.split("@")[0],
          };
          this.isAuthenticated = true;

          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("isAuthenticated", "true");

          resolve(this.user);
        }, 500);
      });
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },

    initializeFromLocalStorage() {
      const user = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (user && isAuthenticated === "true") {
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      }
    },
  },
});
