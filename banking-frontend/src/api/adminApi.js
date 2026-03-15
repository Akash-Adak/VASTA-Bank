import axios from "axios";

const api = axios.create({
  baseURL: "/api/admin",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAdminDashboard = () =>
  api.get("/dashboard");

export const getPendingLoans = () =>
  api.get("/dashboard/loans/pending");

export const approveLoan = (id) =>
  api.patch(`/dashboard/loans/${id}/approve`);

export const rejectLoan = (id) =>
  api.patch(`/dashboard/loans/${id}/reject`);


export const getAllUsers = () =>
  api.get(`/dashboard/user/details`);


export const getActiveLoans = () =>
  api.get("/dashboard/loans/active");

export const blockUser = (accountNumber) =>
  api.patch(`/dashboard/user/block/${accountNumber}`);

export const unBlockUser = (accountNumber) =>
  api.patch(`/dashboard/user/unblock/${accountNumber}`);

