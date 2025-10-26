// src/api/apiRoutes.js

const BASE_URL = "http://localhost:3000/api";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },
  USERS: {
    PROFILE: `${BASE_URL}/users/profile`,
    UPDATE: `${BASE_URL}/users/update`,
  },
  // You can add more later, e.g.
  // PLACEMENTS: { LIST: `${BASE_URL}/placements` },
};
