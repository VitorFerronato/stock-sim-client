import apiClient from "../configs/server";

export default {
  getSummary() {
    return apiClient.get("/summary");
  },
  getPortfolio() {
    return apiClient.get("/portfolio");
  },
};
