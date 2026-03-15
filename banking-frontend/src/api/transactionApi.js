import axios from "axios";

const api = axios.create({
  baseURL: "/api/transactions",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Transfer Money
export const transferMoney = (data) => {
  return api.post("/send-money", data);
};


