import { http } from "./httpClient";

export const notificacoesApi = {
  listar: () => http.get("/notificacoes"),
  marcarTodasLidas: () => http.patch("/notificacoes/marcar-lidas"),
  enviarComunicado: (titulo, texto) =>
    http.post("/notificacoes/comunicado", { titulo, texto })
};
