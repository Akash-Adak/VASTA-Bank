import axios from "axios";

const api_loan = axios.create({
  baseURL:"",
});

api_loan.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api_loan;
