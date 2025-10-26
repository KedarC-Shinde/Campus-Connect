// src/services/authService.js
import { authApi } from "../api/authApi";

export const authService = {
  loginUser: async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
};
