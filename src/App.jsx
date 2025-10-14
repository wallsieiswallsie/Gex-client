import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import InputDetailPackage from "./pages/InputDetailPackage";
import DisplayDetailPackage from "./pages/DisplayDetailPackage";
import PackagesByKarungPage from "./pages/PackagesByKarungPage";
import ArchivePackages from "./pages/ArchivePackages";
import BatchSelectionPage from "./pages/batches/BatchSelectionPage";
import DisplayBatchesKapal from "./pages/batches/DisplayBatchesKapal";
import DisplayBatchesPesawat from "./pages/batches/DisplayBatchesPesawat";
import BatchDetailKapal from "./pages/batches/BatchDetailKapal";
import BatchDetailPesawat from "./pages/batches/BatchDetailPesawat";
import InvoicesPage from "./pages/ManageInvoice";
import InvoiceDetailPage from "./pages/InvoiceDetail";
import ArchivedInvoicesPage from "./pages/ArchivedInvoicesPage";
import DeliverySelectionPage from "./pages/deliveries/DeliverySelectionPage";
import ManageDelivery from "./pages/deliveries/ManageDelivery";
import ActiveDeliveries from "./pages/deliveries/ActiveDeliveries";
import ArchiveDeliveries from "./pages/deliveries/ArchiveDeliveries";
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
                <ProtectedRoute allowedRoles={["Staff Main Warehouse", "Manager Main Warehouse"]}>
                  <InputDetailPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packages"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <DisplayDetailPackage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/archive_packages"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <ArchivePackages />
                </ProtectedRoute>
              }
            />

            {/* =================== BATCHES =================== */}
            {/* Pilihan Kapal / Pesawat */}
            <Route
              path="/batches"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <BatchSelectionPage />
                </ProtectedRoute>
              }
            />

            {/* Semua batch Kapal */}
            <Route
              path="/batches/kapal"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <DisplayBatchesKapal />
                </ProtectedRoute>
              }
            />

            {/* Semua batch Pesawat */}
            <Route
              path="/batches/pesawat"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <DisplayBatchesPesawat />
                </ProtectedRoute>
              }
            />

            {/* Detail batch Kapal */}
            <Route
              path="/batches/kapal/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <BatchDetailKapal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/kapal/:batchId/karung/:noKarung"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <PackagesByKarungPage />
                </ProtectedRoute>
              }
            />

            {/* Detail batch Pesawat */}
            <Route
              path="/batches/pesawat/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <BatchDetailPesawat />
                </ProtectedRoute>
              }
            />
            {/* =================== END BATCHES =================== */}

            {/* Invoices */}
            <Route
              path="/invoices"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse"]}>
                  <InvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archived_invoices"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse"]}>
                  <ArchivedInvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse"]}>
                  <InvoiceDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/selection_pengantaran"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse"]}>
                  <DeliverySelectionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pengantaran"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse"]}>
                  <ManageDelivery />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pengantaran_active"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse"]}>
                  <ActiveDeliveries />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pengantaran_archive"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse"]}>
                  <ArchiveDeliveries />
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