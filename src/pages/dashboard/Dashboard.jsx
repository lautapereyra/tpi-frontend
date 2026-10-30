import "./css/dashboard.css";

function Dashboard() {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Resumen</h1>
        <p>Resumen general del negocio.</p>
      </header>

      <section className="dashboard-stats">
        <article className="stat-card">
          <h3>Ventas de hoy</h3>
          <p>$ 0,00</p>
        </article>

        <article className="stat-card">
          <h3>Productos activos</h3>
          <p>0</p>
        </article>

        <article className="stat-card">
          <h3>Stock bajo</h3>
          <p>0</p>
        </article>

        <article className="stat-card">
          <h3>Pagos pendientes</h3>
          <p>$ 0,00</p>
        </article>
      </section>

      <section className="dashboard-section">
        <h2>Ventas de la semana</h2>
      </section>

      <section className="dashboard-bottom">
        <article className="dashboard-section">
          <h2>Alertas de stock</h2>
        </article>

        <article className="dashboard-section">
          <h2>Últimos movimientos</h2>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
