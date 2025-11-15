import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import React, { useState } from "react";
import RegisterPage from "./pages/Register";
import LoginPageCustomer from "./pages/LoginPageCustomer";
import RegisterPageCustomer from "./pages/RegisterPageCustomer";

import InputDetailPackage from "./pages/InputDetailPackage";
import DisplayDetailPackage from "./pages/DisplayDetailPackage";
import ConfirmPackageForm from "./components/ConfirmPackageForm";
import ConfirmPackagesSelectionPage from "./components/ConfirmPackagesSelectionPage";
import ManageCustomerService from "./pages/customer_services/manage/ManageCustomerService";
import LacakPaketCustomer from "././pages/customer_services/LacakPaketCustomer";
import SyaratKetentuanPageDisplay from "./pages/customer_services/display/SyaratKetentuanPageDisplay";
import SyaratKetentuanPage from "./pages/customer_services/manage/SyaratKetentuanPage";
import JadwalKirimPage from "./pages/customer_services/manage/JadwalKirimPage";
import JadwalKirimPageDisplay from "./pages/customer_services/display/JadwalKirimPageDisplay";
import LokasiKontakPage from "./pages/customer_services/manage/LokasiKontakPage";
import LokasiKontakPageDisplay from "./pages/customer_services/display/LokasiKontakPageDisplay";
import SeringDitanyakanPage from "./pages/customer_services/manage/SeringDitanyakanPage";
import SeringDitanyakanPageDisplay from "./pages/customer_services/display/SeringDitanyakanPageDisplay";

import PackagesByKarungPage from "./pages/PackagesByKarungPage";
import ArchivePackages from "./pages/ArchivePackages";
import BatchSelectionPage from "./pages/batches/BatchSelectionPage";
import DisplayBatchesKapal from "./pages/batches/DisplayBatchesKapal";
import DisplayBatchesPesawat from "./pages/batches/DisplayBatchesPesawat";
import BatchDetailKapal from "./pages/batches/BatchDetailKapal";
import DisplayPackageBatchKapal from "./pages/batches/DisplayPackageBatchKapal";
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
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { getRedirectPathByRole } from "./utils/routes";
import "./App.css";

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hideNavbar =
  ["/login-customer", "/register-customer"].includes(location.pathname);

  // Jika user sudah login, redirect otomatis ke halaman sesuai role
  if (user && ["/", "/login-customer"].includes(location.pathname)) {
    const redirectPath = getRedirectPathByRole(user.role);

    // Hindari loop redirect
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return (
   <div className={`app-root ${!hideNavbar && user ? "with-sidebar" : ""}`}>
  {/* Sidebar */}
  {!hideNavbar && user && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}

  {/* Konten utama */}
  <div className="main-content">
    {!hideNavbar && 
      <Navbar
        user={user}
        onLogout={logout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    }
    <main>
        <Routes>
          {/* ========== Semua route kamu tetap sama ========== */}
          <Route path="/" element={<Navigate to="/lacak_paket" replace />} />

            <Route path="/login-customer" element={<LoginPageCustomer />} />
            <Route path="/register-customer" element={<RegisterPageCustomer />} />
            <Route
              path="/lacak_paket"
              element={
                  <LacakPaketCustomer />
              }
            />

            {/* Proteksi berbasis role */}
            
            <Route
              path="/input"
              element={
                <ProtectedRoute allowedRoles={["Staff Main Warehouse", "Manager Main Warehouse", "Manager Destination Warehouse"]}>
                  <InputDetailPackage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register"
              element={
                <ProtectedRoute allowedRoles={["Manager Main Warehouse"]}>
                  <RegisterPage />
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
              path="/packages/confirm-select"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <ConfirmPackagesSelectionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/packages/confirm-form"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <ConfirmPackageForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/syarat-ketentuan"
              element={<SyaratKetentuanPageDisplay />}
            />

            <Route
              path="/syarat-ketentuan"
              element={
                <ProtectedRoute allowedRoles={["Manager Main Warehouse"]}>
                  <SyaratKetentuanPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jadwal_kirim"
              element={
                <ProtectedRoute allowedRoles={["Manager Main Warehouse"]}>
                  <JadwalKirimPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/jadwal_kirim"
              element={<JadwalKirimPageDisplay />}
            />

            <Route
              path="/lokasi-kontak"
              element={
                <ProtectedRoute allowedRoles={["Manager Main Warehouse"]}>
                  <LokasiKontakPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/lokasi-kontak"
              element={<LokasiKontakPageDisplay />}
            />

            <Route
              path="/sering_ditanyakan"
              element={
                <ProtectedRoute allowedRoles={["Manager Main Warehouse"]}>
                  <SeringDitanyakanPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/sering_ditanyakan"
              element={<SeringDitanyakanPageDisplay />}
            />

            <Route
              path="/manage-customer-services"
              element={
                <ProtectedRoute allowedRoles={["Manager Main Warehouse"]}>
                  <ManageCustomerService />
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
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Main Warehouse"]}>
                  <BatchSelectionPage />
                </ProtectedRoute>
              }
            />

            {/* Semua batch Kapal */}
            <Route
              path="/batches/kapal"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Main Warehouse"]}>
                  <DisplayBatchesKapal />
                </ProtectedRoute>
              }
            />

            {/* Semua batch Pesawat */}
            <Route
              path="/batches/pesawat"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Main Warehouse"]}>
                  <DisplayBatchesPesawat />
                </ProtectedRoute>
              }
            />

            {/* Detail batch Kapal */}
            <Route
              path="/batches/kapal/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Main Warehouse"]}>
                  <BatchDetailKapal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/kapal/:batchId/all"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <DisplayPackageBatchKapal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/kapal/:batchId/karung/:noKarung"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Main Warehouse"]}>
                  <PackagesByKarungPage />
                </ProtectedRoute>
              }
            />

            {/* Detail batch Pesawat */}
            <Route
              path="/batches/pesawat/:batchId"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Main Warehouse"]}>
                  <BatchDetailPesawat />
                </ProtectedRoute>
              }
            />
            {/* =================== END BATCHES =================== */}

            {/* Invoices */}
            <Route
              path="/invoices"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <InvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archived_invoices"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <ArchivedInvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse"]}>
                  <InvoiceDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/selection_pengantaran"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse","Courier"]}>
                  <DeliverySelectionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pengantaran"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse","Courier"]}>
                  <ManageDelivery />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pengantaran_active"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse","Courier"]}>
                  <ActiveDeliveries />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pengantaran_archive"
              element={
                <ProtectedRoute allowedRoles={["Manager Destination Warehouse", "Manager Main Warehouse","Courier"]}>
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