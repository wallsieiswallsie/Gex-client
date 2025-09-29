import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import InputDetailPackage from "./pages/InputDetailPackage";
import DisplayDetailPackage from "./pages/DisplayDetailPackage";
import InvoicesPage from "./pages/ManageInvoice";
import InvoiceDetailPage from "./pages/invoiceDetail";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // sembunyikan navbar di login & register
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex">
      {!hideNavbar && user && <Sidebar />}
      
      <div className={`flex-1 flex flex-col ${!hideNavbar && user ? "with-sidebar" : ""}`}>
        {!hideNavbar && user && <Navbar user={user} onLogout={logout} />}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/input" element={<InputDetailPackage />} />
            <Route path="/packages" element={<DisplayDetailPackage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;