import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <a href="/" className="navbar-brand">
                <span className="navbar-logo">G</span>
                <span className="navbar-title">Gestión Comercial</span>
            </a>

            <div className="navbar-links">
                <a href="/" className="navbar-link active">
                    Resumen
                </a>

                <a href="/productos" className="navbar-link">
                    Productos
                </a>

                <a href="/ventas" className="navbar-link">
                    Ventas
                </a>

                <a href="/clientes" className="navbar-link">
                    Clientes
                </a>
            </div>
        </nav>
    );
}

export default Navbar;