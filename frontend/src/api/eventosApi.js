import { http } from "./httpClient";

export const eventosApi = {
  listar: (filtros = {}) => {
    const qs = new URLSearchParams(filtros).toString();
    return http.get(`/eventos${qs ? `?${qs}` : ""}`);
  },
  obter: (id) => http.get(`/eventos/${id}`),
  criar: (payload) => http.post("/eventos", payload),
  atualizar: (id, payload) => http.put(`/eventos/${id}`, payload),
  excluir: (id) => http.delete(`/eventos/${id}`)
};
