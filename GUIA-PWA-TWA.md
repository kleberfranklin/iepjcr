# IEPJCR — publicando o app na Play Store via TWA

Este guia parte do que já está pronto no projeto (`frontend/public/manifest.json`,
`frontend/public/sw.js`, ícones em `frontend/public/icons/`) até o `.aab` pronto
para a Google Play Console.

## 1. Hospedar o front-end (obrigatório — precisa de HTTPS público)

```bash
cd frontend
npm install
npm run build      # gera frontend/dist
```

Suba a pasta `dist/` em qualquer host com HTTPS: Vercel, Netlify, Cloudflare Pages
ou seu próprio servidor com Nginx. A TWA só funciona apontando para um domínio
público — não existe TWA de `localhost`.

Depois de publicado, confirme no navegador do celular:
- `https://SEU_DOMINIO/manifest.json` abre e mostra o JSON.
- `https://SEU_DOMINIO/sw.js` abre e mostra o script.
- O Chrome mostra o botão "Instalar app" ao visitar o site — se aparecer, o PWA
  está correto e pronto para virar TWA.

## 2. Gerar o projeto Android com o Bubblewrap

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://SEU_DOMINIO/manifest.json
```

O CLI faz perguntas (nome do pacote, ex. `br.org.iepjcr.app`, versão, ícone) e
gera uma pasta com o projeto Android pronto (usa o `manifest.json` que já está
neste repositório, então a maior parte já vem preenchida sozinha).

## 3. Assinar e gerar o pacote

```bash
bubblewrap build
```

Isso gera `app-release-bundle.aab` — é esse arquivo que sobe na Play Console.
Guarde o arquivo `android.keystore` gerado nesse passo em local seguro: é a
chave que assina todas as versões futuras do app.

## 4. Verificação Digital Asset Links (obrigatório)

Para o Android abrir o app sem a barra de endereço do navegador (modo "TWA de
verdade"), publique em `https://SEU_DOMINIO/.well-known/assetlinks.json` o
arquivo que o `bubblewrap build` gera em
`android/app/src/main/res/values/strings.xml` (o CLI mostra o conteúdo exato
ao final do build). Sem esse arquivo, o app abre mas mostra a barra de URL do
Chrome por cima — funciona, mas não parece um app nativo.

## 5. Google Play Console

1. Conta de desenvolvedor (taxa única de US$ 25): https://play.google.com/console
2. Criar o app → enviar o `.aab` gerado no passo 3.
3. Preencher: descrição, categoria, ícone (1024×1024 — pode ampliar o
   `icon-512.png` já incluso), capturas de tela (pelo menos 2, em formato
   retrato), classificação de conteúdo, política de privacidade (obrigatório
   por lidar com dados de membros — CPF, endereço, foto).
4. Enviar para revisão (costuma levar de algumas horas a poucos dias).

## Atualizações depois de publicado

- Mudança de conteúdo/tela/lógica: só faça `npm run build` e suba a pasta
  `dist/` de novo no host. O app instalado no celular do membro atualiza
  sozinho na próxima vez que abrir com internet — não precisa nova revisão
  na Play Store.
- Mudança de nome, ícone ou versão do pacote Android: aí sim precisa gerar um
  novo `.aab` (passo 3) e reenviar para revisão.

## Backend

Lembre que hoje os dados ficam só no navegador (localStorage). Antes de
publicar de verdade, o `backend/` (Spring Boot) precisa estar rodando em um
servidor com HTTPS público e o front precisa apontar `VITE_API_URL`
(`frontend/.env`) para ele — veja `iepjcr-schema.sql` para o banco PostgreSQL.
