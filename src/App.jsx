import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import InputDetailPackage from "./pages/InputDetailPackage";
import DisplayDetailPackage from "./pages/DisplayDetailPackage";
import InvoicesPage from "./pages/ManageInvoice";
import InvoiceDetailPage from "./pages/InvoiceDetail";
import ForbiddenPage from "./pages/errors/ForbiddenPage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { getRedirectPathByRole } from "./utils/routes";
import "./App.css";

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex">
      {!hideNavbar && user && <Sidebar />}

      <div
        className={`flex-1 flex flex-col ${
          !hideNavbar && user ? "with-sidebar" : ""
        }`}
      >
        {!hideNavbar && user && <Navbar user={user} onLogout={logout} />}
        <main className="flex-1 p-4">
          <Routes>
            {/* Redirect root "/" sesuai role */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={getRedirectPathByRole(user.role)} replace />
                ) : (
                  <LoginPage />
                )
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Proteksi berbasis role */}
            <Route
              path="/input"
              element={
                <ProtectedRoute allowedRoles={["main_warehouse_staff"]}>
                  <InputDetailPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packages"
              element={
                <ProtectedRoute allowedRoles={["manager_destination_shipping"]}>
                  <DisplayDetailPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute allowedRoles={["manager_destination_shipping"]}>
                  <InvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute allowedRoles={["manager_destination_shipping"]}>
                  <InvoiceDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Halaman forbidden */}
            <Route path="/forbidden" element={<ForbiddenPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;