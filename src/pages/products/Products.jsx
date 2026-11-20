import { useEffect, useState } from "react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import "./products.css";

const UNIDADES = [
  { value: "Unit", label: "Unidad" },
  { value: "Gram", label: "Gramo" },
  { value: "Kilogram", label: "Kilogramo" },
  { value: "Liter", label: "Litro" },
  { value: "Meter", label: "Metro" },
  { value: "Centimeter", label: "Centímetro" },
  { value: "Millimeter", label: "Milímetro" },
];

const formatoPrecio = (precio) =>
  Number(precio || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriasApi, setCategoriasApi] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  // Modal de productos
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    barcode: "",
    name: "",
    description: "",
    categoryId: "",
    salePrice: "",
    cost: "",
    currentStock: "",
    minimumStock: "5",
    measurementUnit: "Unit",
    isActive: true,
  });

  // Modal de categorías
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [formCategoria, setFormCategoria] = useState({
    name: "",
    description: "",
  });

  const categoriasActivas = categoriasApi.filter((c) => c.isActive);

  const cargarDatos = async () => {
    setCargando(true);
    setError("");
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProductos(prods);
      setCategoriasApi(cats);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const getNombreCategoria = (categoryId) =>
    categoriasApi.find((c) => c.id === categoryId)?.name || "Sin categoría";

  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre =
      producto.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.barcode || "").toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "Todas" ||
      String(producto.categoryId) === String(categoriaFiltro);

    return coincideNombre && coincideCategoria;
  });

  // --- CRUD Productos ---
  const abrirNuevo = () => {
    setProductoEditando(null);
    setFormulario({
      barcode: "",
      name: "",
      description: "",
      categoryId: categoriasActivas[0]?.id ? String(categoriasActivas[0].id) : "",
      salePrice: "",
      cost: "0",
      currentStock: "0",
      minimumStock: "5",
      measurementUnit: "Unit",
      isActive: true,
    });
    setModalAbierto(true);
  };

  const abrirEdicion = (producto) => {
    setProductoEditando(producto);
    setFormulario({
      barcode: producto.barcode || "",
      name: producto.name,
      description: producto.description || "",
      categoryId: String(producto.categoryId),
      salePrice: String(producto.salePrice),
      cost: String(producto.cost),
      currentStock: String(producto.currentStock),
      minimumStock: String(producto.minimumStock),
      measurementUnit: producto.measurementUnit || "Unit",
      isActive: producto.isActive,
    });
    setModalAbierto(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setError("");

    const dto = {
      barcode: formulario.barcode.trim(),
      name: formulario.name.trim(),
      description: formulario.description.trim() || "Sin descripción",
      salePrice: Number(formulario.salePrice),
      cost: Number(formulario.cost),
      currentStock: Number(formulario.currentStock),
      minimumStock: Number(formulario.minimumStock),
      measurementUnit: formulario.measurementUnit,
      isActive: formulario.isActive,
      categoryId: Number(formulario.categoryId),
    };

    try {
      if (productoEditando) {
        await productService.update(productoEditando.id, dto);
      } else {
        await productService.create(dto);
      }
      setModalAbierto(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Querés desactivar este producto?")) return;
    try {
      await productService.remove(id);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- CRUD Categorías ---
  const crearCategoria = async (e) => {
    e.preventDefault();
    setError("");

    const dto = {
      name: formCategoria.name.trim(),
      description: formCategoria.description.trim() || "Sin descripción",
      isActive: true,
    };

    if (!dto.name) return;

    try {
      await categoryService.create(dto);
      setFormCategoria({ name: "", description: "" });
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCategoriaActiva = async (cat) => {
    setError("");
    try {
      await categoryService.update(cat.id, {
        name: cat.name,
        description: cat.description || "Sin descripción",
        isActive: !cat.isActive,
      });
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarCategoria = async (id) => {
    if (!window.confirm("¿Querés eliminar esta categoría?")) return;
    setError("");
    try {
      await categoryService.remove(id);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="productos-page">
      <header className="productos-header">
        <div>
          <h1>Productos</h1>
          <p>Administrá los productos y categorías de tu negocio.</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="productos-btn-secondary"
            onClick={() => setModalCategoriaAbierto(true)}
          >
            + Categorías
          </button>

          <button className="productos-btn-primary" onClick={abrirNuevo}>
            + Nuevo producto
          </button>
        </div>
      </header>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      <section className="productos-stats">
        <article className="productos-stat">
          <span>Total de productos</span>
          <strong>{productos.length}</strong>
        </article>

        <article className="productos-stat">
          <span>Con stock bajo</span>
          <strong>
            {productos.filter(
              (p) => p.currentStock > 0 && p.currentStock <= p.minimumStock
            ).length}
          </strong>
        </article>

        <article className="productos-stat">
          <span>Sin stock</span>
          <strong>{productos.filter((p) => p.currentStock === 0).length}</strong>
        </article>
      </section>

      <section className="productos-panel">
        <div className="productos-toolbar">
          <input
            type="search"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="Todas">Todas</option>
            {categoriasApi.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} {!cat.isActive ? "(Inactiva)" : ""}
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
              {cargando ? (
                <tr>
                  <td colSpan="6" className="productos-empty">
                    Cargando productos...
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td className="productos-name">
                      {producto.name}
                      {!producto.isActive && " (Inactivo)"}
                    </td>
                    <td>{getNombreCategoria(producto.categoryId)}</td>
                    <td>{formatoPrecio(producto.salePrice)}</td>
                    <td>{producto.currentStock}</td>
                    <td>
                      <span
                        className={`productos-badge ${
                          producto.currentStock === 0
                            ? "sin-stock"
                            : producto.currentStock <= producto.minimumStock
                              ? "stock-bajo"
                              : "disponible"
                        }`}
                      >
                        {producto.currentStock === 0
                          ? "Sin stock"
                          : producto.currentStock <= producto.minimumStock
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
                ))
              )}

              {!cargando && productosFiltrados.length === 0 && (
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

      {/* Modal Producto */}
      {modalAbierto && (
        <div className="productos-modal-overlay">
          <form className="productos-modal" onSubmit={guardarProducto}>
            <h2>{productoEditando ? "Editar producto" : "Nuevo producto"}</h2>

            <label>
              Código de barras
              <input
                required
                value={formulario.barcode}
                onChange={(e) =>
                  setFormulario({ ...formulario, barcode: e.target.value })
                }
                placeholder="Ej: 7791234567890"
              />
            </label>

            <label>
              Nombre
              <input
                required
                value={formulario.name}
                onChange={(e) =>
                  setFormulario({ ...formulario, name: e.target.value })
                }
                placeholder="Nombre del producto"
              />
            </label>

            <label>
              Descripción
              <input
                value={formulario.description}
                onChange={(e) =>
                  setFormulario({ ...formulario, description: e.target.value })
                }
                placeholder="Descripción del producto"
              />
            </label>

            <label>
              Categoría
              <select
                required
                value={formulario.categoryId}
                onChange={(e) =>
                  setFormulario({ ...formulario, categoryId: e.target.value })
                }
              >
                <option value="">Seleccionar categoría activa</option>
                {categoriasActivas.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Precio de venta
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={formulario.salePrice}
                onChange={(e) =>
                  setFormulario({ ...formulario, salePrice: e.target.value })
                }
              />
            </label>

            <label>
              Costo
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formulario.cost}
                onChange={(e) =>
                  setFormulario({ ...formulario, cost: e.target.value })
                }
              />
            </label>

            <label>
              Stock actual
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formulario.currentStock}
                onChange={(e) =>
                  setFormulario({ ...formulario, currentStock: e.target.value })
                }
              />
            </label>

            <label>
              Stock mínimo
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formulario.minimumStock}
                onChange={(e) =>
                  setFormulario({ ...formulario, minimumStock: e.target.value })
                }
              />
            </label>

            <label>
              Unidad de medida
              <select
                value={formulario.measurementUnit}
                onChange={(e) =>
                  setFormulario({ ...formulario, measurementUnit: e.target.value })
                }
              >
                {UNIDADES.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
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

      {/* Modal Categorías */}
      {modalCategoriaAbierto && (
        <div className="productos-modal-overlay">
          <div className="productos-modal">
            <h2>Administrar categorías</h2>

            <form
              onSubmit={crearCategoria}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label>
                Nombre de la nueva categoría
                <input
                  required
                  value={formCategoria.name}
                  onChange={(e) =>
                    setFormCategoria({ ...formCategoria, name: e.target.value })
                  }
                  placeholder="Ej: Periféricos"
                />
              </label>

              <label>
                Descripción
                <input
                  value={formCategoria.description}
                  onChange={(e) =>
                    setFormCategoria({
                      ...formCategoria,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descripción breve (opcional)"
                />
              </label>

              <button type="submit" className="productos-btn-primary">
                Crear categoría
              </button>
            </form>

            <div style={{ marginTop: "1rem", maxHeight: 220, overflowY: "auto" }}>
              {categoriasApi.length === 0 ? (
                <p>No hay categorías cargadas.</p>
              ) : (
                categoriasApi.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.4rem 0",
                      borderBottom: "1px solid rgba(128,128,128,0.2)",
                    }}
                  >
                    <span>
                      <strong>{cat.name}</strong>{" "}
                      <small>({cat.isActive ? "Activa" : "Inactiva"})</small>
                    </span>

                    <div className="productos-actions">
                      <button
                        type="button"
                        className="productos-btn-edit"
                        onClick={() => toggleCategoriaActiva(cat)}
                      >
                        {cat.isActive ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        className="productos-btn-delete"
                        onClick={() => eliminarCategoria(cat.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="productos-modal-actions">
              <button
                type="button"
                className="productos-btn-secondary"
                onClick={() => setModalCategoriaAbierto(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Productos;