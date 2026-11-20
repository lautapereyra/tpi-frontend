import { apiFetch, TOKEN_KEY, USER_KEY, clearSession } from "./api";

export const authService = {
  async login(email, password) {
    const data = await apiFetch("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout() {
    clearSession();
  },

  getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
};