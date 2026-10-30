import { http } from "./httpClient";

export const usuariosApi = {
  listar: () => http.get("/usuarios"),
  criar: (payload) => http.post("/usuarios", payload),
  atualizar: (id, payload) => http.put(`/usuarios/${id}`, payload),
  alternarAtivo: (id) => http.patch(`/usuarios/${id}/alternar-ativo`),
  trocarSenha: (senhaAtual, novaSenha) =>
    http.patch("/usuarios/me/senha", { senhaAtual, novaSenha })
};
