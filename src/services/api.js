const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5250/api";

export const TOKEN_KEY = "gestion-comercial-token";
export const USER_KEY = "gestion-comercial-user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth-logout"));
}

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearSession();
    throw new Error("Sesión vencida o no autorizada. Volvé a iniciar sesión.");
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.title || "Error en la solicitud al servidor.";
    throw new Error(message);
  }

  return data;
}