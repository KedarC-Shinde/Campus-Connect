// src/api/authApi.js
import axios from "axios";
import { API_ROUTES } from "./apiRoutes";

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_ROUTES.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login API Error:", error.response || error.message);
      throw error.response?.data || error;
    }
  },

  register: async (email, password, name) => {
    try {
      const response = await axios.post(API_ROUTES.AUTH.REGISTER, {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error) {
      console.error("Register API Error:", error.response || error.message);
      throw error.response?.data || error;
    }
  },
};
