import { useState } from "react";
import { authService } from "../../services/authService";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="productos-page" style={{ maxWidth: 420, margin: "4rem auto" }}>
      <form className="productos-modal" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        {error && <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>}

        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@correo.com"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className="productos-modal-actions">
          <button type="submit" className="productos-btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default Login;