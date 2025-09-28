import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import InputDetailPackage from "./pages/InputDetailPackage";
import DisplayDetailPackage from "./pages/DisplayDetailPackage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // sembunyikan navbar di login & register
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex">
      {!hideNavbar && user && <Sidebar />}
      
      <div className={`flex-1 flex flex-col ${!hideNavbar && user ? "with-sidebar" : ""}`}>
  {!hideNavbar && user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<LoginPage setUser={setUser} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage setUser={setUser} />} />
            <Route path="/input" element={<InputDetailPackage />} />
            <Route path="/packages" element={<DisplayDetailPackage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
