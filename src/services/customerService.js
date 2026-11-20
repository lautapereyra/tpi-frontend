import { apiFetch } from "./api";

export const customerService = {
  getAll: () => apiFetch("/Customer"),
  getById: (id) => apiFetch(`/Customer/${id}`),
  create: (dto) =>
    apiFetch("/Customer", { method: "POST", body: JSON.stringify(dto) }),
  update: (id, dto) =>
    apiFetch(`/Customer/${id}`, { method: "PUT", body: JSON.stringify(dto) }),
  remove: (id) => apiFetch(`/Customer/${id}`, { method: "DELETE" }),
};