import { apiFetch } from "./api";

export const categoryService = {
  getAll: () => apiFetch("/Categories"),
  getById: (id) => apiFetch(`/Categories/${id}`),
  create: (dto) =>
    apiFetch("/Categories", { method: "POST", body: JSON.stringify(dto) }),
  update: (id, dto) =>
    apiFetch(`/Categories/${id}`, { method: "PUT", body: JSON.stringify(dto) }),
  remove: (id) => apiFetch(`/Categories/${id}`, { method: "DELETE" }),
};