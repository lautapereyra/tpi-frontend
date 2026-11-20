import { useEffect, useState } from "react";
import { saleService } from "../../services/saleService";
import { productService } from "../../services/productService";
import { customerService } from "../../services/customerService";
import "./sales.css";

const STATUS_LABELS = {
  Approved: "Completada",
  Pending: "Pendiente",
  Cancelled: "Cancelada",
};

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");

  const [customerId, setCustomerId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, productsData, customersData] = await Promise.all([
        saleService.getAll(),
        productService.getAll(),
        customerService.getAll(),
      ]);
      setSales(salesData);
      setProducts(productsData.filter((p) => p.isActive));
      setCustomers(customersData.filter((c) => c.isActive));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const getCustomerName = (id) => {
    if (!id) return "Consumidor final";
    const found = customers.find((c) => c.id === id);
    return found ? `${found.firstName} ${found.lastName}`.trim() : `Cliente #${id}`;
  };

  const total = cart.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);

  const filteredSales = sales.filter((sale) => {
    const customerName = getCustomerName(sale.idCustomer);
    const statusLabel = STATUS_LABELS[sale.status] || sale.status;
    const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "Todas" || statusLabel === filter;
    return matchesSearch && matchesFilter;
  });

  const addProduct = () => {
    const product = products.find((item) => item.id === Number(selectedProduct));
    if (!product || quantity < 1) return;

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: Number(quantity) }]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeProduct = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const registerSale = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setError("");

    const dto = {
      idCustomer: customerId ? Number(customerId) : null,
      details: cart.map((item) => ({
        idProduct: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await saleService.create(dto);
      setCart([]);
      setCustomerId("");
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await saleService.confirm(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("¿Querés anular esta venta?")) return;
    try {
      await saleService.cancel(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="sales-page">
      <div className="sales-header">
        <div>
          <h1>Ventas</h1>
          <p>Administrá las ventas de tu negocio.</p>
        </div>

        <button
          className="sales-primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "+ Nueva venta"}
        </button>
      </div>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {showForm && (
        <section className="sale-form">
          <h2>Registrar nueva venta</h2>

          <form onSubmit={registerSale}>
            <div className="sale-form-fields">
              <div className="sale-field">
                <label>Cliente</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="">Consumidor final</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sale-field">
                <label>Producto</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.salePrice)} (Stock: {product.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sale-field">
                <label>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <button
                type="button"
                className="sales-secondary-button"
                onClick={addProduct}
                disabled={!selectedProduct || quantity < 1}
              >
                Agregar producto
              </button>
            </div>

            <div className="sale-cart">
              <h3>Productos de la venta</h3>

              {cart.length === 0 ? (
                <p className="sale-empty">Todavía no agregaste productos.</p>
              ) : (
                <div className="sale-cart-list">
                  {cart.map((item) => (
                    <div className="sale-cart-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.quantity} x {formatPrice(item.salePrice)}
                        </span>
                      </div>

                      <div className="sale-cart-actions">
                        <strong>{formatPrice(item.salePrice * item.quantity)}</strong>
                        <button type="button" onClick={() => removeProduct(item.id)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="sale-total">
                <span>Total de la venta</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="sales-primary-button"
              disabled={cart.length === 0}
            >
              Registrar venta
            </button>
          </form>
        </section>
      )}

      <section className="sales-summary">
        <div className="sales-summary-card">
          <span>Ventas registradas</span>
          <strong>{sales.length}</strong>
        </div>

        <div className="sales-summary-card">
          <span>Ventas completadas</span>
          <strong>{sales.filter((s) => s.status === "Approved").length}</strong>
        </div>

        <div className="sales-summary-card">
          <span>Facturación registrada</span>
          <strong>
            {formatPrice(
              sales
                .filter((s) => s.status === "Approved")
                .reduce((acc, s) => acc + s.total, 0)
            )}
          </strong>
        </div>
      </section>

      <section className="sales-table-section">
        <div className="sales-table-header">
          <div>
            <h2>Listado de ventas</h2>
            <p>Consultá las operaciones registradas.</p>
          </div>

          <div className="sales-filters">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="Todas">Todos los estados</option>
              <option value="Completada">Completadas</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        <div className="sales-table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>N° Venta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Ítems</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="sales-no-results">
                    Cargando ventas...
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const statusLabel = STATUS_LABELS[sale.status] || sale.status;
                  const itemCount = (sale.details || []).reduce(
                    (acc, d) => acc + d.quantity,
                    0
                  );

                  return (
                    <tr key={sale.id}>
                      <td>#{sale.id}</td>
                      <td>{getCustomerName(sale.idCustomer)}</td>
                      <td>{new Date(sale.date).toLocaleDateString("es-AR")}</td>
                      <td>{itemCount}</td>
                      <td>{formatPrice(sale.total)}</td>
                      <td>
                        <span
                          className={`sale-status ${
                            sale.status === "Approved" ? "completed" : "pending"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: "0.4rem" }}>
                        {sale.status === "Pending" && (
                          <button
                            className="sales-secondary-button"
                            onClick={() => handleConfirm(sale.id)}
                          >
                            Confirmar
                          </button>
                        )}
                        {sale.status !== "Cancelled" && (
                          <button
                            className="sales-secondary-button"
                            onClick={() => handleCancel(sale.id)}
                          >
                            Anular
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && filteredSales.length === 0 && (
                <tr>
                  <td colSpan="7" className="sales-no-results">
                    No se encontraron ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Sales;