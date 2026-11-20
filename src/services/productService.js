import { apiFetch } from "./api";

export const productService = {
  getAll: () => apiFetch("/Product"),
  getById: (id) => apiFetch(`/Product/${id}`),
  getByBarcode: (barcode) => apiFetch(`/Product/barcode/${barcode}`),
  create: (dto) =>
    apiFetch("/Product", { method: "POST", body: JSON.stringify(dto) }),
  update: (id, dto) =>
    apiFetch(`/Product/${id}`, { method: "PUT", body: JSON.stringify(dto) }),
  remove: (id) => apiFetch(`/Product/${id}`, { method: "DELETE" }),
};