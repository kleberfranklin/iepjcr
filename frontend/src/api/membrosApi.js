import { http } from "./httpClient";

export const membrosApi = {
  listar: (filtros = {}) => {
    const qs = new URLSearchParams(filtros).toString();
    return http.get(`/membros${qs ? `?${qs}` : ""}`);
  },
  obter: (id) => http.get(`/membros/${id}`),
  criar: (payload) => http.post("/membros", payload),
  atualizar: (id, payload) => http.put(`/membros/${id}`, payload),
  aprovar: (id, observacao) => http.patch(`/membros/${id}/aprovar`, { observacao }),
  reprovar: (id, observacao) => http.patch(`/membros/${id}/reprovar`, { observacao }),
  minhaCarteirinha: () => http.get("/membros/me/carteirinha")
};
