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

import FinanceSelectionBranchPage from "./pages/finance/FinanceSelectionBranchPage";

import RemuModaSelectionPage from "./pages/finance/remu/RemuModaSelectionPage";
import RemuKapalBatchList from "./pages/finance/remu/RemuKapalBatchList";
import RemuKapalFinancialStatements from "./pages/finance/remu/RemuKapalFinancialStatements";
import RemuPesawatBatchList from "./pages/finance/remu/RemuPesawatBatchList";
import RemuPesawatFinancialStatements from "./pages/finance/remu/RemuPesawatFinancialStatements";

import AimasModaSelectionPage from "./pages/finance/aimas/AimasModaSelectionPage";
import AimasKapalBatchList from "./pages/finance/aimas/AimasKapalBatchList";
import AimasKapalFinancialStatements from "./pages/finance/aimas/AimasKapalFinancialStatements";
import AimasPesawatBatchList from "./pages/finance/aimas/AimasPesawatBatchList";
import AimasPesawatFinancialStatements from "./pages/finance/aimas/AimasPesawatFinancialStatements";

import ForbiddenPage from "./pages/errors/ForbiddenPage";
import ServerError from "./pages/errors/ServerErrorPage";
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

            {/* =================== FINANCE =================== */}

            <Route
              path="/finance"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <FinanceSelectionBranchPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/finance/remu"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <RemuModaSelectionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/finance/remu/kapal"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <RemuKapalBatchList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/remu-kapal/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <RemuKapalFinancialStatements />
                </ProtectedRoute>
              }
            />

            <Route
              path="/finance/remu/pesawat"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <RemuPesawatBatchList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/remu-pesawat/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <RemuPesawatFinancialStatements />
                </ProtectedRoute>
              }
            />

            <Route
              path="/finance/aimas"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <AimasModaSelectionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/finance/aimas/kapal"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <AimasKapalBatchList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/aimas-kapal/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <AimasKapalFinancialStatements />
                </ProtectedRoute>
              }
            />

            <Route
              path="/finance/aimas/pesawat"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <AimasPesawatBatchList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/aimas-pesawat/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <AimasPesawatFinancialStatements />
                </ProtectedRoute>
              }
            />

            {/* Halaman forbidden */}
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/server-error" element={<ServerError />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;