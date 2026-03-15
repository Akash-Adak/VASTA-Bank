import axios from "axios";

const api_transaction = axios.create({
  baseURL: "",
});

api_transaction.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api_transaction;
