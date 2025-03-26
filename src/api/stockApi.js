import axios from "axios";

const API_KEY = "5QYJ0Q5V38HITVZZ";
const BASE_URL = "https://www.alphavantage.co/query";

export const stockApi = {
  getQuote: async (symbol) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: "GLOBAL_QUOTE",
          symbol,
          apikey: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stock quote:", error);
      throw error;
    }
  },

  searchStocks: async (keywords) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: "SYMBOL_SEARCH",
          keywords,
          apikey: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching stocks:", error);
      throw error;
    }
  },

  getDailyTimeSeries: async (symbol) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: "TIME_SERIES_DAILY",
          symbol,
          outputsize: "compact",
          apikey: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching time series:", error);
      throw error;
    }
  },
};
