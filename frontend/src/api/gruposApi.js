import { http } from "./httpClient";

export const gruposApi = {
  listar: () => http.get("/grupos"),
  criar: (payload) => http.post("/grupos", payload),
  atualizar: (id, payload) => http.put(`/grupos/${id}`, payload),
  desabilitar: (id) => http.patch(`/grupos/${id}/desabilitar`),
  definirLider: (id, membroId) => http.patch(`/grupos/${id}/lider`, { membroId }),
  alternarMembro: (id, membroId) => http.patch(`/grupos/${id}/membros/${membroId}/alternar`)
};
