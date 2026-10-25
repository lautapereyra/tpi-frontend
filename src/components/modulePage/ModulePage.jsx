import { useState } from "react";
import "./ModulePage.css";

function ModulePage({ title, description, columns, initialData, actionLabel = "Nuevo registro" }) {
    const [busqueda, setBusqueda] = useState("");

    const datosFiltrados = initialData.filter((fila) =>
        Object.values(fila).some((valor) =>
            String(valor).toLowerCase().includes(busqueda.toLowerCase())
        )
    );

    return (
        <main className="module-page">
            <header className="module-header">
                <div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>

                <button
                    className="module-primary-button"
                    onClick={() => alert("Próximamente: " + actionLabel)}
                >
                    + {actionLabel}
                </button>
            </header>

            <section className="module-panel">
                <div className="module-toolbar">
                    <input
                        type="search"
                        placeholder={`Buscar en ${title.toLowerCase()}...`}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <span className="module-count">
                        {datosFiltrados.length} registros
                    </span>
                </div>

                <div className="module-table-wrapper">
                    <table className="module-table">
                        <thead>
                            <tr>
                                {columns.map((columna) => (
                                    <th key={columna.key}>{columna.label}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {datosFiltrados.map((fila, index) => (
                                <tr key={fila.id ?? index}>
                                    {columns.map((columna) => (
                                        <td key={columna.key}>
                                            {fila[columna.key] ?? "—"}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {datosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="module-empty">
                                        No se encontraron registros.
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

export default ModulePage;