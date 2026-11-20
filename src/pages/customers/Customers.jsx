import { useEffect, useState } from "react";
import { customerService } from "../../services/customerService";
import { saleService } from "../../services/saleService";
import "./customers.css";

const emptyForm = {
  firstName: "",
  lastName: "",
  dni: "",
  email: "",
  phone: "",
  address: "",
  isActive: true,
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [customersData, salesData] = await Promise.all([
        customerService.getAll(),
        saleService.getAll().catch(() => []),
      ]);

      const enriched = customersData.map((c) => {
        const purchases = salesData
          .filter((s) => s.idCustomer === c.id && s.status !== "Cancelled")
          .map((s) => ({
            id: s.id,
            date: new Date(s.date).toLocaleDateString("es-AR"),
            products: `${(s.details || []).reduce((acc, d) => acc + d.quantity, 0)} ítem(s)`,
            total: s.total,
          }));

        return {
          ...c,
          name: `${c.firstName} ${c.lastName}`.trim(),
          status: c.isActive ? "Activo" : "Inactivo",
          purchases,
        };
      });

      setCustomers(enriched);
      if (selectedCustomer) {
        const updated = enriched.find((c) => c.id === selectedCustomer.id);
        setSelectedCustomer(updated || null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getTotal = (customer) =>
    customer.purchases.reduce((sum, purchase) => sum + purchase.total, 0);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      (customer.dni || "").includes(search) ||
      (customer.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "Todos" || customer.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalSales = customers.reduce((sum, c) => sum + getTotal(c), 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const openNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const openEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      dni: customer.dni,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      isActive: customer.isActive,
    });
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const dto = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dni: formData.dni.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      address: formData.address.trim() || null,
      isActive: formData.isActive,
    };

    try {
      if (editingId) {
        await customerService.update(editingId, dto);
      } else {
        await customerService.create(dto);
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Querés eliminar este cliente?")) return;
    try {
      await customerService.remove(id);
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Clientes</h1>
          <p>Administrá tus clientes y consultá su actividad.</p>
        </div>

        <button className="customers-primary-button" onClick={openNew}>
          + Nuevo cliente
        </button>
      </div>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      <section className="customers-summary">
        <article className="customers-summary-card">
          <span>Total de clientes</span>
          <strong>{customers.length}</strong>
        </article>

        <article className="customers-summary-card">
          <span>Clientes activos</span>
          <strong>{customers.filter((c) => c.isActive).length}</strong>
        </article>

        <article className="customers-summary-card">
          <span>Compras registradas</span>
          <strong>
            {customers.reduce((sum, c) => sum + c.purchases.length, 0)}
          </strong>
        </article>

        <article className="customers-summary-card">
          <span>Total vendido a clientes</span>
          <strong>{formatMoney(totalSales)}</strong>
        </article>
      </section>

      {showForm && (
        <section className="customers-form-section">
          <h2>{editingId ? "Editar cliente" : "Registrar cliente"}</h2>

          <form onSubmit={handleSubmit} className="customers-form">
            <div className="customers-form-grid">
              <label>
                Nombre
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Apellido
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                DNI
                <input
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Teléfono
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>

              <label className="customers-full-field">
                Dirección
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="customers-form-actions">
              <button
                type="button"
                className="customers-secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>

              <button type="submit" className="customers-primary-button">
                {editingId ? "Guardar cambios" : "Guardar cliente"}
              </button>
            </div>
          </form>
        </section>
      )}

      {selectedCustomer ? (
        <section className="customer-detail">
          <div className="customer-detail-header">
            <div>
              <button
                className="customers-back-button"
                onClick={() => setSelectedCustomer(null)}
              >
                ← Volver a clientes
              </button>

              <h2>{selectedCustomer.name}</h2>

              <span className={`customer-status ${selectedCustomer.status.toLowerCase()}`}>
                {selectedCustomer.status}
              </span>
            </div>
          </div>

          <div className="customer-info-grid">
            <article className="customer-info-card">
              <span>DNI</span>
              <strong>{selectedCustomer.dni}</strong>
            </article>
            <article className="customer-info-card">
              <span>Email</span>
              <strong>{selectedCustomer.email || "Sin registrar"}</strong>
            </article>
            <article className="customer-info-card">
              <span>Teléfono</span>
              <strong>{selectedCustomer.phone || "Sin registrar"}</strong>
            </article>
            <article className="customer-info-card">
              <span>Dirección</span>
              <strong>{selectedCustomer.address || "Sin registrar"}</strong>
            </article>
          </div>

          <div className="customer-purchase-summary">
            <article>
              <span>Cantidad de compras</span>
              <strong>{selectedCustomer.purchases.length}</strong>
            </article>
            <article>
              <span>Total comprado</span>
              <strong>{formatMoney(getTotal(selectedCustomer))}</strong>
            </article>
            <article>
              <span>Última compra</span>
              <strong>{selectedCustomer.purchases[0]?.date || "Sin compras"}</strong>
            </article>
          </div>

          <div className="customer-history">
            <h3>Historial de compras</h3>
            {selectedCustomer.purchases.length === 0 ? (
              <p className="customers-empty">
                Este cliente todavía no tiene compras registradas.
              </p>
            ) : (
              <div className="customers-table-container">
                <table className="customers-table">
                  <thead>
                    <tr>
                      <th>N.º de venta</th>
                      <th>Fecha</th>
                      <th>Productos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.purchases.map((purchase) => (
                      <tr key={purchase.id}>
                        <td>#{purchase.id}</td>
                        <td>{purchase.date}</td>
                        <td>{purchase.products}</td>
                        <td>{formatMoney(purchase.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="customers-list-section">
          <div className="customers-list-header">
            <h2>Listado de clientes</h2>

            <div className="customers-filters">
              <input
                type="text"
                placeholder="Buscar por nombre, DNI o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="Todos">Todos los estados</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
          </div>

          <div className="customers-table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Compras</th>
                  <th>Total comprado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="customers-empty">
                      Cargando clientes...
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td><strong>{customer.name}</strong></td>
                      <td>{customer.dni}</td>
                      <td>{customer.email || "-"}</td>
                      <td>{customer.purchases.length}</td>
                      <td>{formatMoney(getTotal(customer))}</td>
                      <td>
                        <span className={`customer-status ${customer.status.toLowerCase()}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          className="customers-view-button"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          Ver
                        </button>
                        <button
                          className="customers-view-button"
                          onClick={() => openEdit(customer)}
                        >
                          Editar
                        </button>
                        <button
                          className="customers-view-button"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="customers-empty">
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default Customers;