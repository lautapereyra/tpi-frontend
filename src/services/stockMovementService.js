import { apiFetch } from "./api";

export const stockMovementService = {
  getAll: () => apiFetch("/StockMovement"),
  create: (dto) =>
    apiFetch("/StockMovement", { method: "POST", body: JSON.stringify(dto) }),
};