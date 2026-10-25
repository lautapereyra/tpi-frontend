import "./Footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-left">
                <span className="footer-brand">Gestión Comercial</span>
                <span className="footer-copyright">
                    © {currentYear} Todos los derechos reservados.
                </span>
            </div>

            <div className="footer-right">
                <span className="footer-status">
                    <span className="footer-status-dot"></span>
                    Sistema operativo
                </span>

                <span className="footer-version">Versión 1.0.0</span>
            </div>
        </footer>
    );
}

export default Footer;