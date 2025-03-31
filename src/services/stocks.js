import apiClient from "../configs/server";

export default {
  getSummary() {
    return apiClient.get("/summary");
  },
  getPortfolio() {
    return apiClient.get("/portfolio");
  },
  getStocks(symbol) {
    return apiClient.get(`/getStocks?symbol=${symbol}`);
  },
  getStockPrice(symbol) {
    return apiClient.get(`/getStockPrice?symbol=${symbol}`);
  },
  buyShares(request) {
    return apiClient.post("/portfolio", request);
  },
};
