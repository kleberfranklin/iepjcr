# IEPJCR — Gestão da Igreja

Aplicação web (PWA) e API para a **IEPJCR — Igreja Evangélica Pentecostal Jesus Cristo é a Resposta**: cadastro de membros com aprovação pastoral, carteirinha digital com QR Code, eventos, calendário, grupos, usuários com controle de acesso por perfil e relatórios.

- **Front-end:** React 18 + Vite, instalável como PWA
- **Back-end:** Java 21 + Spring Boot 3.3 (API REST, JWT, RBAC)
- **Banco:** PostgreSQL com migrações Flyway

## Funcionalidades

- **Login por CPF ou celular** e senha, com botão **Cadastre-se** (nome completo + celular) para o pré-cadastro público
- **Cadastro de membros** completo: foto 3x4, dados pessoais, família e filhos, endereço com busca de CEP (ViaCEP) e vida eclesiástica
- **Fluxo de aprovação:** Pendente → Aprovado ou Reprovado, com justificativa; a aprovação libera o acesso e gera a carteirinha
- **Carteirinha digital** no modelo do cartão físico da igreja (frente e verso) com QR Code de validação
- **Eventos** (cadastrar, editar, excluir, pesquisar) e **calendário**
- **Grupos:** só o pastor promove ou remove líderes; o líder associa membros
- **Usuários e perfis:** Administrador, Pastor(a), Secretário(a), Líder e Membro
- **Notificações** e comunicados da igreja
- **Relatórios** de membros
- **Modo offline** via Service Worker (consulta offline e leituras da API em cache)
- Tema claro e escuro, layout responsivo (menu lateral no desktop, barra inferior com "Mais" no celular)

## Estrutura

```
iepjcr-projeto/
├── backend/                      API Spring Boot
│   └── src/main/
│       ├── java/br/org/iepjcr/
│       │   ├── config/           Segurança e CORS
│       │   ├── security/         JWT, filtro e UserDetails
│       │   ├── controller/       Endpoints REST
│       │   ├── service/          Regras de negócio
│       │   ├── repository/       Spring Data JPA
│       │   ├── domain/           Entidades e enums
│       │   ├── dto/              Request e Response
│       │   └── exception/        Tratamento global de erros
│       └── resources/
│           ├── application.yml
│           └── db/migration/     V1__schema.sql, V2__solicitacao_acesso.sql
├── frontend/                     React + Vite
│   ├── public/                   manifest.json, sw.js, ícones, logo
│   └── src/
│       ├── api/                  httpClient e um módulo por recurso
│       ├── components/           layout, common, membros, carteirinha, eventos, calendario
│       ├── views/                uma tela por rota
│       ├── routes/               AppRoutes e ProtectedRoute (RBAC)
│       ├── context/              Auth e Theme
│       ├── hooks/                usePermissions, useNotificacoes, useSnackbar
│       ├── constants/            rbac.js e listas de domínio
│       └── utils/                máscaras, validadores (CPF), datas
└── GUIA-PWA-TWA.md               Publicação na Google Play
```

## Pré-requisitos

- Java 21+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+

## Como rodar

### 1. Banco de dados

```sql
CREATE USER iepjcr WITH PASSWORD 'iepjcr';
CREATE DATABASE iepjcr OWNER iepjcr;
```

As tabelas são criadas pelo Flyway na primeira subida da API.

### 2. Back-end

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080/api`. Para outro host, porta ou credenciais, use as variáveis abaixo.

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_HOST` | `localhost` | Host do PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_NAME` | `iepjcr` | Nome do banco |
| `DB_USER` / `DB_PASSWORD` | `iepjcr` / `iepjcr` | Credenciais |
| `JWT_SECRET` | valor de exemplo | **Troque em produção** por uma chave forte |
| `JWT_EXPIRACAO_MINUTOS` | `480` | Validade do token |
| `CORS_ORIGENS` | `http://localhost:5173` | Origens permitidas do front-end |
| `PORT` | `8080` | Porta da API |
| `FIREBASE_CREDENTIALS_PATH` | vazio | Credenciais do FCM (push) |

Perfil de desenvolvimento, com SQL e logs detalhados: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`.

> O Hibernate roda com `ddl-auto: validate`: o schema é responsabilidade exclusiva do Flyway. Nunca edite uma migração já aplicada; crie uma nova (`V3__...sql`).

### 3. Front-end

```bash
cd frontend
cp .env.example .env      # ajuste VITE_API_URL se necessário
npm install
npm run dev
```

Abre em `http://localhost:5173`. Em desenvolvimento, as chamadas a `/api` passam pelo proxy do Vite para `localhost:8080`.

Build de produção: `npm run build` (saída em `frontend/dist`).

### Primeiro acesso

A migração V1 cria o usuário `admin` (`admin@iepjcr.org`). Ele entra pelo login `admin` ou pelo e-mail (o login por CPF ou celular vale para usuários vinculados a um membro). Defina a senha do administrador gerando um hash BCrypt e atualizando `usuario.senha_hash` antes de usar em qualquer ambiente compartilhado.

## Perfis e permissões

| Tela | Administrador | Pastor(a) | Secretário(a) | Líder | Membro |
|---|:-:|:-:|:-:|:-:|:-:|
| Painel, Calendário, Eventos, Carteirinha | ✓ | ✓ | ✓ | ✓ | ✓ |
| Notificações, Meu perfil | ✓ | ✓ | ✓ | ✓ | ✓ |
| Membros | ✓ | ✓ | ✓ | — | — |
| Grupos | ✓ | ✓ | consulta | só os que lidera | — |
| Usuários | ✓ | ✓ | — | — | — |
| Relatórios | ✓ | ✓ | ✓ | ✓ | — |
| Configurações | ✓ | — | — | — | — |

A regra vive em dois lugares que precisam andar juntos: `frontend/src/constants/rbac.js` (o que cada perfil enxerga) e `@PreAuthorize` nos controllers (o que a API realmente permite). O front só esconde telas; quem protege os dados é o back-end.

## API

Prefixo `/api`. Autenticação por `Authorization: Bearer <token>`, exceto os endpoints públicos.

| Recurso | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/pre-cadastro`, `GET /auth/me` |
| Membros | `GET /membros`, `GET/PUT /membros/{id}`, `POST /membros`, `PATCH /membros/{id}/aprovar`, `PATCH /membros/{id}/reprovar`, `GET /membros/me/carteirinha` |
| Eventos | `GET/POST /eventos`, `GET/PUT/DELETE /eventos/{id}` |
| Grupos | `GET/POST /grupos`, `PUT /grupos/{id}`, `PATCH /grupos/{id}/desabilitar`, `PATCH /grupos/{id}/lider`, `PATCH /grupos/{id}/membros/{membroId}/alternar` |
| Usuários | `GET/POST /usuarios`, `PUT /usuarios/{id}`, `PATCH /usuarios/{id}/alternar-ativo`, `PATCH /usuarios/me/senha` |
| Notificações | `POST /notificacoes/comunicado` |
| Relatórios | `GET /relatorios/membros/resumo` |

## Publicação

O front-end já inclui `manifest.json`, Service Worker e ícones. O passo a passo para hospedar, gerar o pacote Android com Bubblewrap (TWA) e publicar na Google Play está em [`GUIA-PWA-TWA.md`](GUIA-PWA-TWA.md).

## Status e próximos passos

O projeto cobre o fluxo principal, mas ainda tem lacunas conhecidas:

- [ ] `GET /notificacoes` e `PATCH /notificacoes/marcar-lidas`: a tabela `notificacao_destinatario` existe no banco, mas falta a entidade e os endpoints (o front já os chama)
- [ ] Recuperação de senha (`/auth/recuperar-senha` está liberado na segurança, mas não implementado)
- [ ] Relatórios por grupo, faixa etária e eventos, com exportação em PDF e Excel
- [ ] Envio de push via Firebase Cloud Messaging (o SDK já está no `pom.xml`)
- [ ] Calendário nas visões dia, semana e ano (hoje só mês)
- [ ] Fila de sincronização offline para escritas (hoje o Service Worker cobre só leituras)
- [ ] Aplicativo React Native nativo (o app Android atual é PWA/TWA)
- [ ] Testes automatizados e pipeline de CI

## Segurança e LGPD

Senhas com BCrypt, autenticação JWT, controle de acesso por perfil e tabelas de auditoria e consentimento LGPD no schema. O projeto trata dados pessoais sensíveis (CPF, endereço, foto, vínculo religioso): antes de ir para produção, use HTTPS, troque o `JWT_SECRET`, restrinja `CORS_ORIGENS` e publique uma política de privacidade.
