
import { useState } from "react";
import "./customers.css";

const initialCustomers = [
    {
        id: 1,
        name: "Juan Pérez",
        dni: "35123456",
        email: "juan@gmail.com",
        phone: "341 555-1234",
        address: "Rosario, Santa Fe",
        status: "Activo",
        purchases: [
            { id: 1001, date: "28/10/2026", products: "Teclado mecánico", total: 45000 },
            { id: 1002, date: "15/10/2026", products: "Mouse inalámbrico", total: 28000 },
            { id: 1003, date: "02/09/2026", products: "Monitor 24 pulgadas", total: 180000 },
        ],
    },
    {
        id: 2,
        name: "María González",
        dni: "32987654",
        email: "maria@gmail.com",
        phone: "341 555-5678",
        address: "Funes, Santa Fe",
        status: "Activo",
        purchases: [
            { id: 1004, date: "25/10/2026", products: "Auriculares", total: 55000 },
            { id: 1005, date: "10/08/2026", products: "Mouse inalámbrico", total: 28000 },
        ],
    },
    {
        id: 3,
        name: "Carlos López",
        dni: "30111222",
        email: "carlos@gmail.com",
        phone: "341 555-9012",
        address: "Rosario, Santa Fe",
        status: "Inactivo",
        purchases: [
            { id: 1006, date: "12/06/2026", products: "Monitor 24 pulgadas", total: 180000 },
        ],
    },
];

function Customers() {
    const [customers, setCustomers] = useState(initialCustomers);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todos");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        dni: "",
        email: "",
        phone: "",
        address: "",
    });

    const formatMoney = (amount) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(amount);

    const getTotal = (customer) =>
        customer.purchases.reduce((sum, purchase) => sum + purchase.total, 0);

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.dni.includes(search) ||
            customer.email.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "Todos" || customer.status === filter;

        return matchesSearch && matchesFilter;
    });

    const totalSales = customers.reduce(
        (sum, customer) => sum + getTotal(customer),
        0
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newCustomer = {
            id: Date.now(),
            ...formData,
            status: "Activo",
            purchases: [],
        };

        setCustomers([...customers, newCustomer]);

        setFormData({
            name: "",
            dni: "",
            email: "",
            phone: "",
            address: "",
        });

        setShowForm(false);
    };

    return (
        <main className="customers-page">
            <div className="customers-header">
                <div>
                    <h1>Clientes</h1>
                    <p>Administrá tus clientes y consultá su actividad.</p>
                </div>

                <button
                    className="customers-primary-button"
                    onClick={() => {
                        setSelectedCustomer(null);
                        setShowForm(!showForm);
                    }}
                >
                    + Nuevo cliente
                </button>
            </div>

            <section className="customers-summary">
                <article className="customers-summary-card">
                    <span>Total de clientes</span>
                    <strong>{customers.length}</strong>
                </article>

                <article className="customers-summary-card">
                    <span>Clientes activos</span>
                    <strong>
                        {customers.filter((customer) => customer.status === "Activo").length}
                    </strong>
                </article>

                <article className="customers-summary-card">
                    <span>Compras registradas</span>
                    <strong>
                        {customers.reduce(
                            (sum, customer) => sum + customer.purchases.length,
                            0
                        )}
                    </strong>
                </article>

                <article className="customers-summary-card">
                    <span>Total vendido a clientes</span>
                    <strong>{formatMoney(totalSales)}</strong>
                </article>
            </section>

            {showForm && (
                <section className="customers-form-section">
                    <h2>Registrar cliente</h2>

                    <form onSubmit={handleSubmit} className="customers-form">
                        <div className="customers-form-grid">
                            <label>
                                Nombre completo
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre y apellido"
                                    required
                                />
                            </label>

                            <label>
                                DNI
                                <input
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    placeholder="Número de documento"
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
                                    placeholder="correo@email.com"
                                />
                            </label>

                            <label>
                                Teléfono
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="341 555-0000"
                                />
                            </label>

                            <label className="customers-full-field">
                                Dirección
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Ciudad, provincia"
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
                                Guardar cliente
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
                            <strong>
                                {selectedCustomer.purchases[0]?.date || "Sin compras"}
                            </strong>
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

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
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
                                {filteredCustomers.map((customer) => (
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
                                        <td>
                                            <button
                                                className="customers-view-button"
                                                onClick={() => setSelectedCustomer(customer)}
                                            >
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredCustomers.length === 0 && (
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

