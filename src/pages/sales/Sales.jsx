
import { useState } from "react";
import "./sales.css";

const initialProducts = [
    { id: 1, name: "Teclado mecánico", price: 45000 },
    { id: 2, name: "Mouse inalámbrico", price: 28000 },
    { id: 3, name: "Monitor 24 pulgadas", price: 180000 },
    { id: 4, name: "Auriculares", price: 55000 },
];

const initialSales = [
    {
        id: 1,
        customer: "Juan Pérez",
        date: "30/10/2026",
        total: 73000,
        status: "Completada",
        items: 2,
    },
    {
        id: 2,
        customer: "María González",
        date: "29/10/2026",
        total: 180000,
        status: "Completada",
        items: 1,
    },
    {
        id: 3,
        customer: "Carlos López",
        date: "28/10/2026",
        total: 55000,
        status: "Pendiente",
        items: 1,
    },
];

const customers = [
    "Juan Pérez",
    "María González",
    "Carlos López",
    "Ana Martínez",
];

function Sales() {
    const [sales, setSales] = useState(initialSales);
    const [nextSaleId, setNextSaleId] = useState(initialSales.length + 1);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todas");

    const [customer, setCustomer] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);

    const formatPrice = (price) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(price);

    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const filteredSales = sales.filter((sale) => {
        const matchesSearch = sale.customer
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "Todas" || sale.status === filter;

        return matchesSearch && matchesFilter;
    });

    const addProduct = () => {
        const product = initialProducts.find(
            (item) => item.id === Number(selectedProduct)
        );

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
            setCart([
                ...cart,
                { ...product, quantity: Number(quantity) },
            ]);
        }

        setSelectedProduct("");
        setQuantity(1);
    };

    const removeProduct = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const registerSale = (e) => {
        e.preventDefault();

        if (!customer || cart.length === 0) return;

        const newSale = {
            id: nextSaleId,
            customer,
            date: new Date().toLocaleDateString("es-AR"),
            total,
            status: "Completada",
            items: cart.reduce((acc, item) => acc + item.quantity, 0),
        };

        setSales([newSale, ...sales]);
        setNextSaleId((currentId) => currentId + 1);
        setCart([]);
        setCustomer("");
        setShowForm(false);
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

            {showForm && (
                <section className="sale-form">
                    <h2>Registrar nueva venta</h2>

                    <form onSubmit={registerSale}>
                        <div className="sale-form-fields">
                            <div className="sale-field">
                                <label>Cliente</label>
                                <select
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {customers.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
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
                                    {initialProducts.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - {formatPrice(product.price)}
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
                                <p className="sale-empty">
                                    Todavía no agregaste productos.
                                </p>
                            ) : (
                                <div className="sale-cart-list">
                                    {cart.map((item) => (
                                        <div className="sale-cart-item" key={item.id}>
                                            <div>
                                                <strong>{item.name}</strong>
                                                <span>
                                                    {item.quantity} x {formatPrice(item.price)}
                                                </span>
                                            </div>

                                            <div className="sale-cart-actions">
                                                <strong>
                                                    {formatPrice(item.price * item.quantity)}
                                                </strong>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduct(item.id)}
                                                >
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
                            disabled={!customer || cart.length === 0}
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
                    <strong>
                        {sales.filter((sale) => sale.status === "Completada").length}
                    </strong>
                </div>

                <div className="sales-summary-card">
                    <span>Facturación registrada</span>
                    <strong>
                        {formatPrice(
                            sales
                                .filter((sale) => sale.status === "Completada")
                                .reduce((acc, sale) => acc + sale.total, 0)
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

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="Todas">Todos los estados</option>
                            <option value="Completada">Completadas</option>
                            <option value="Pendiente">Pendientes</option>
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
                                <th>Productos</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSales.map((sale) => (
                                <tr key={sale.id}>
                                    <td>#{sale.id}</td>
                                    <td>{sale.customer}</td>
                                    <td>{sale.date}</td>
                                    <td>{sale.items}</td>
                                    <td>{formatPrice(sale.total)}</td>
                                    <td>
                                        <span
                                            className={`sale-status ${sale.status === "Completada"
                                                ? "completed"
                                                : "pending"
                                                }`}
                                        >
                                            {sale.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="sales-no-results">
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
