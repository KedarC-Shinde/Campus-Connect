// src/api/authApi.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login API Error:", error.response || error.message);
      throw error.response?.data || error;
    }
  },
};
