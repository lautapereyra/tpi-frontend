import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ darkMode, toggleTheme }) {
    const navLinkClass = ({ isActive }) =>
        isActive ? "navbar-link active" : "navbar-link";

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">
                <span className="navbar-logo">G</span>
                <span className="navbar-title">Gestión Comercial</span>
            </NavLink>

            <div className="navbar-links">
                <NavLink to="/" end className={navLinkClass}>
                    Resumen
                </NavLink>

                <NavLink to="/productos" className={navLinkClass}>
                    Productos
                </NavLink>

                <NavLink to="/ventas" className={navLinkClass}>
                    Ventas
                </NavLink>

                <NavLink to="/clientes" className={navLinkClass}>
                    Clientes
                </NavLink>
            </div>
            <button
                className="theme-button"
                type="button"
                onClick={toggleTheme}
                aria-pressed={darkMode}
                aria-label={`Cambiar a modo ${darkMode ? "claro" : "oscuro"}`}
            >
                {darkMode ? "Modo claro" : "Modo oscuro"}
            </button>
        </nav>
    );
}

export default Navbar;