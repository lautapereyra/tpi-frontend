import { apiFetch } from "./api";

export const saleService = {
  getAll: () => apiFetch("/Sale"),
  getById: (id) => apiFetch(`/Sale/${id}`),
  create: (dto) =>
    apiFetch("/Sale", { method: "POST", body: JSON.stringify(dto) }),
  confirm: (id) => apiFetch(`/Sale/${id}/confirm`, { method: "POST" }),
  cancel: (id) => apiFetch(`/Sale/${id}`, { method: "DELETE" }),
};