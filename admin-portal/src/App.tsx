import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UsersManagement from "./pages/UsersManagement";
import KYCManagement from "./pages/KYCManagement";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AdminAuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Admin Route */}
          <Route path="/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminProtectedRoute>
                <UsersManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/kyc"
            element={
              <AdminProtectedRoute>
                <KYCManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <AdminProtectedRoute>
                <Analytics />
              </AdminProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

