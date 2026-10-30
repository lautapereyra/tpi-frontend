import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Dashboard from "./pages/dashboard/Dashboard";
import Productos from "./pages/products/Products";
import Sales from "./pages/sales/Sales";
import Customers from "./pages/customers/Customers";

import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("gestion-comercial-theme") === "dark",
  );

  const toggleTheme = () => {
    setDarkMode((previousMode) => !previousMode);
  };

  useEffect(() => {
    localStorage.setItem("gestion-comercial-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

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
