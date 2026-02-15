import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import UserDashboard from "./pages/dashboard/UserDashboard";
import AccountsPage from "./pages/dashboard/AccountsPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import LoansPage from "./pages/dashboard/LoansPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminDashboard from "./pages/Admin-dashboard/AdminDashboard";

import SendMoney from "./pages/money/SendMoney";
import AddMoney from "./pages/money/AddMoney";
import Withdraw from "./pages/money/WithDraw";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import KycPage from "./pages/dashboard/KycPage";
import AdminLoans from "./pages/Admin-dashboard/AdminLoans";
import AdminUsers from "./pages/Admin-dashboard/AdminUsers";
import AdminActiveLoans from "./pages/Admin-dashboard/AdminActiveLoans";
import VerifyOtp from "./pages/auth/VerifyOtp";

export default function App() {
  const username = localStorage.getItem("username");
  const role = username
    ? localStorage.getItem(`${username}-role`)
    : null;

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* SMART DASHBOARD ROUTE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <UserDashboard />
              )}
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/dashboard/accounts"
          element={
            <ProtectedRoute>
              <AccountsPage />
            </ProtectedRoute>
          }
        />

      <Route path="/kyc" element={ 
           <ProtectedRoute>
              <KycPage/>
            </ProtectedRoute>} />

        <Route
          path="/dashboard/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

       <Route
        path="/dashboard/loans"
        element={
          <ProtectedRoute>
            {role === "ADMIN" ? (
              <Navigate to="/admin/loans" replace />
            ) : (
              <LoansPage />
            )}
          </ProtectedRoute>
        }
      />


        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Money Operations */}
        <Route
          path="/send-money"
          element={
            <ProtectedRoute>
              <SendMoney />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-money"
          element={
            <ProtectedRoute>
              <AddMoney />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/loans"
          element={  <AdminRoute> <AdminLoans/> </AdminRoute>}
        />

        <Route
          path="/admin/loans/active"
          element={<AdminRoute> <AdminActiveLoans/></AdminRoute>}
        />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />


        {/* SAFETY FALLBACK */}
        <Route
          path="*"
          element={
            role === "ADMIN" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
