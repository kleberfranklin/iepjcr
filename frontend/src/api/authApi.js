import { http } from "./httpClient";

// POST /api/auth/login  { identificador, senha } -> { token, usuario }
// identificador = CPF ou numero de celular
export const authApi = {
  login: (identificador, senha) =>
    http.post("/auth/login", { identificador, senha }, { auth: false }),

  preCadastro: (nome, celular) =>
    http.post("/auth/pre-cadastro", { nome, celular }, { auth: false }),

  recuperarSenha: (identificador) =>
    http.post("/auth/recuperar-senha", { identificador }, { auth: false }),

  me: () => http.get("/auth/me")
};
