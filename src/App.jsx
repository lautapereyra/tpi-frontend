import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Dashboard from "./pages/dashboard/Dashboard";
import Productos from "./pages/products/Products";
import Sales from "./pages/sales/Sales";
import Customers from "./pages/customers/Customers";
import Login from "./pages/login/Login";
import { authService } from "./services/authService";
import { getToken } from "./services/api";

import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("gestion-comercial-theme") === "dark"
  );
  const [user, setUser] = useState(() =>
    getToken() ? authService.getCurrentUser() : null
  );

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  useEffect(() => {
    localStorage.setItem("gestion-comercial-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const onAutoLogout = () => setUser(null);
    window.addEventListener("auth-logout", onAutoLogout);
    return () => window.removeEventListener("auth-logout", onAutoLogout);
  }, []);

  if (!user) {
    return (
      <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
        <Login onLoginSuccess={setUser} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Sales />} />
          <Route path="/clientes" element={<Customers />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;