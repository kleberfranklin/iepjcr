// Service Worker do IEPJCR.
// Estratégias:
//  - Navegação (SPA):        network-first, cai para o index.html em cache quando offline.
//  - Estáticos (JS/CSS/img): cache-first, atualiza em segundo plano (stale-while-revalidate).
//  - Leituras da API (GET):  network-first, guarda a última resposta para consulta offline.
//  - Escritas da API (POST/PUT/PATCH/DELETE): não interceptadas — seguem para a fila de
//    sincronização do próprio app (ver "Modo Offline" no documento de requisitos).

const VERSAO = "iepjcr-v1";
const CACHE_SHELL = `${VERSAO}-shell`;
const CACHE_RUNTIME = `${VERSAO}-runtime`;
const CACHE_API = `${VERSAO}-api`;

const ARQUIVOS_APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_SHELL)
      .then((cache) => cache.addAll(ARQUIVOS_APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(
        chaves
          .filter((chave) => chave.startsWith("iepjcr-") && !chave.startsWith(VERSAO))
          .map((chave) => caches.delete(chave))
      )
    ).then(() => self.clients.claim())
  );
});

function ehNavegacao(requisicao) {
  return requisicao.mode === "navigate";
}

function ehChamadaApi(url) {
  return url.pathname.startsWith("/api/");
}

function ehEstaticoDoApp(url) {
  return url.pathname.startsWith("/assets/") || url.pathname.startsWith("/icons/");
}

self.addEventListener("fetch", (evento) => {
  const requisicao = evento.request;
  const url = new URL(requisicao.url);

  // Só tratamos GET; escritas (POST/PUT/PATCH/DELETE) seguem direto para a rede
  // e, se falharem, é o app (fila de sincronização) que decide o que fazer.
  if (requisicao.method !== "GET") return;

  // 1) Navegação — sempre tenta a rede primeiro, cai para o index.html do cache.
  if (ehNavegacao(requisicao)) {
    evento.respondWith(
      fetch(requisicao)
        .then((resposta) => {
          caches.open(CACHE_SHELL).then((cache) => cache.put("/index.html", resposta.clone()));
          return resposta;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // 2) Leituras da API — network-first, com cache para consulta offline.
  if (ehChamadaApi(url)) {
    evento.respondWith(
      fetch(requisicao)
        .then((resposta) => {
          if (resposta.ok) {
            caches.open(CACHE_API).then((cache) => cache.put(requisicao, resposta.clone()));
          }
          return resposta;
        })
        .catch(() => caches.match(requisicao))
    );
    return;
  }

  // 3) Estáticos do build (JS/CSS/ícones) — cache-first, atualiza em segundo plano.
  if (ehEstaticoDoApp(url) || url.origin === self.location.origin) {
    evento.respondWith(
      caches.match(requisicao).then((emCache) => {
        const buscaRede = fetch(requisicao)
          .then((resposta) => {
            if (resposta.ok) {
              caches.open(CACHE_RUNTIME).then((cache) => cache.put(requisicao, resposta.clone()));
            }
            return resposta;
          })
          .catch(() => emCache);
        return emCache || buscaRede;
      })
    );
  }
});

// Permite que o app force a atualização do Service Worker (ex.: botão "Atualizar app").
self.addEventListener("message", (evento) => {
  if (evento.data === "SKIP_WAITING") self.skipWaiting();
});
