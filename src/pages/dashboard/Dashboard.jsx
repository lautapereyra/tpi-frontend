import { useEffect, useState } from "react";
import { productService } from "../../services/productService";
import { saleService } from "../../services/saleService";
import { stockMovementService } from "../../services/stockMovementService";
import "./css/dashboard.css";

const formatMoney = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount || 0);

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      saleService.getAll().catch(() => []),
      stockMovementService.getAll().catch(() => []),
    ])
      .then(([p, s, m]) => {
        setProducts(p);
        setSales(s);
        setMovements(m);
      })
      .catch((err) => setError(err.message));
  }, []);

  const today = new Date().toDateString();
  const ventasHoy = sales
    .filter(
      (s) => s.status === "Approved" && new Date(s.date).toDateString() === today
    )
    .reduce((acc, s) => acc + s.total, 0);

  const productosActivos = products.filter((p) => p.isActive).length;
  const alertasStock = products.filter(
    (p) => p.isActive && p.currentStock <= p.minimumStock
  );
  const pagosPendientes = sales
    .filter((s) => s.status === "Pending")
    .reduce((acc, s) => acc + s.total, 0);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Resumen</h1>
        <p>Resumen general del negocio.</p>
      </header>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      <section className="dashboard-stats">
        <article className="stat-card">
          <h3>Ventas de hoy</h3>
          <p>{formatMoney(ventasHoy)}</p>
        </article>

        <article className="stat-card">
          <h3>Productos activos</h3>
          <p>{productosActivos}</p>
        </article>

        <article className="stat-card">
          <h3>Stock bajo</h3>
          <p>{alertasStock.length}</p>
        </article>

        <article className="stat-card">
          <h3>Pagos pendientes</h3>
          <p>{formatMoney(pagosPendientes)}</p>
        </article>
      </section>

      <section className="dashboard-bottom">
        <article className="dashboard-section">
          <h2>Alertas de stock</h2>
          {alertasStock.length === 0 ? (
            <p>No hay productos con stock bajo.</p>
          ) : (
            <ul>
              {alertasStock.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — Stock actual: {p.currentStock} (mínimo: {p.minimumStock})
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="dashboard-section">
          <h2>Últimos movimientos</h2>
          {movements.length === 0 ? (
            <p>Sin movimientos registrados.</p>
          ) : (
            <ul>
              {movements.slice(0, 8).map((m) => (
                <li key={m.id}>
                  {new Date(m.date).toLocaleDateString("es-AR")} —{" "}
                  <strong>{m.type}</strong> ({m.quantity}) — {m.reason || "Sin motivo"}
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}

export default Dashboard;