import { useState } from "react";
import "./products.css";

const productosIniciales = [
    { id: 1, nombre: "Teclado mecánico", categoria: "Periféricos", precio: 45000, stock: 15 },
    { id: 2, nombre: "Mouse inalámbrico", categoria: "Periféricos", precio: 22000, stock: 4 },
    { id: 3, nombre: "Monitor 24 pulgadas", categoria: "Monitores", precio: 180000, stock: 8 },
    { id: 4, nombre: "Cable HDMI", categoria: "Accesorios", precio: 8500, stock: 0 },
    { id: 5, nombre: "Auriculares", categoria: "Audio", precio: 35000, stock: 22 },
];

const formatoPrecio = (precio) =>
    precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    });

function Productos() {
    const [productos, setProductos] = useState(productosIniciales);
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        categoria: "Accesorios",
        precio: "",
        stock: "",
    });

    const categorias = [
        "Todas",
        ...new Set(productos.map((producto) => producto.categoria)),
    ];

    const productosFiltrados = productos.filter((producto) => {
        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase());

        const coincideCategoria =
            categoria === "Todas" || producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });

    const abrirNuevo = () => {
        setProductoEditando(null);
        setFormulario({
            nombre: "",
            categoria: "Accesorios",
            precio: "",
            stock: "",
        });
        setModalAbierto(true);
    };

    const abrirEdicion = (producto) => {
        setProductoEditando(producto);
        setFormulario({
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: String(producto.precio),
            stock: String(producto.stock),
        });
        setModalAbierto(true);
    };

    const guardarProducto = (e) => {
        e.preventDefault();

        const producto = {
            id: productoEditando?.id ?? Date.now(),
            nombre: formulario.nombre.trim(),
            categoria: formulario.categoria,
            precio: Number(formulario.precio),
            stock: Number(formulario.stock),
        };

        if (!producto.nombre || producto.precio < 0 || producto.stock < 0) {
            return;
        }

        if (productoEditando) {
            setProductos((actuales) =>
                actuales.map((p) => (p.id === producto.id ? producto : p))
            );
        } else {
            setProductos((actuales) => [...actuales, producto]);
        }

        setModalAbierto(false);
    };

    const eliminarProducto = (id) => {
        if (window.confirm("¿Querés eliminar este producto?")) {
            setProductos((actuales) => actuales.filter((p) => p.id !== id));
        }
    };

    return (
        <main className="productos-page">
            <header className="productos-header">
                <div>
                    <h1>Productos</h1>
                    <p>Administrá los productos de tu negocio.</p>
                </div>

                <button className="productos-btn-primary" onClick={abrirNuevo}>
                    + Nuevo producto
                </button>
            </header>

            <section className="productos-stats">
                <article className="productos-stat">
                    <span>Total de productos</span>
                    <strong>{productos.length}</strong>
                </article>

                <article className="productos-stat">
                    <span>Con stock bajo</span>
                    <strong>
                        {productos.filter((p) => p.stock > 0 && p.stock <= 5).length}
                    </strong>
                </article>

                <article className="productos-stat">
                    <span>Sin stock</span>
                    <strong>{productos.filter((p) => p.stock === 0).length}</strong>
                </article>
            </section>

            <section className="productos-panel">
                <div className="productos-toolbar">
                    <input
                        type="search"
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        aria-label="Filtrar por categoría"
                    >
                        {categorias.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="productos-table-wrapper">
                    <table className="productos-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productosFiltrados.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="productos-name">{producto.nombre}</td>
                                    <td>{producto.categoria}</td>
                                    <td>{formatoPrecio(producto.precio)}</td>
                                    <td>{producto.stock}</td>
                                    <td>
                                        <span
                                            className={`productos-badge ${producto.stock === 0
                                                ? "sin-stock"
                                                : producto.stock <= 5
                                                    ? "stock-bajo"
                                                    : "disponible"
                                                }`}
                                        >
                                            {producto.stock === 0
                                                ? "Sin stock"
                                                : producto.stock <= 5
                                                    ? "Stock bajo"
                                                    : "Disponible"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="productos-actions">
                                            <button
                                                className="productos-btn-edit"
                                                onClick={() => abrirEdicion(producto)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="productos-btn-delete"
                                                onClick={() => eliminarProducto(producto.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {productosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="productos-empty">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {modalAbierto && (
                <div className="productos-modal-overlay">
                    <form className="productos-modal" onSubmit={guardarProducto}>
                        <h2>
                            {productoEditando ? "Editar producto" : "Nuevo producto"}
                        </h2>

                        <label>
                            Nombre
                            <input
                                required
                                value={formulario.nombre}
                                onChange={(e) =>
                                    setFormulario({ ...formulario, nombre: e.target.value })
                                }
                                placeholder="Nombre del producto"
                            />
                        </label>

                        <label>
                            Categoría
                            <input
                                required
                                value={formulario.categoria}
                                onChange={(e) =>
                                    setFormulario({ ...formulario, categoria: e.target.value })
                                }
                            />
                        </label>

                        <label>
                            Precio
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={formulario.precio}
                                onChange={(e) =>
                                    setFormulario({ ...formulario, precio: e.target.value })
                                }
                            />
                        </label>

                        <label>
                            Stock
                            <input
                                type="number"
                                min="0"
                                step="1"
                                required
                                value={formulario.stock}
                                onChange={(e) =>
                                    setFormulario({ ...formulario, stock: e.target.value })
                                }
                            />
                        </label>

                        <div className="productos-modal-actions">
                            <button
                                type="button"
                                className="productos-btn-secondary"
                                onClick={() => setModalAbierto(false)}
                            >
                                Cancelar
                            </button>

                            <button type="submit" className="productos-btn-primary">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

export default Productos;
