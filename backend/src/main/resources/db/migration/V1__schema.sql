-- =====================================================================
-- IEPJCR — Igreja Evangélica Pentecostal Jesus Cristo é a Resposta
-- Modelo de dados PostgreSQL 16+  |  encoding UTF-8  |  timezone America/Sao_Paulo
-- Compatível com Flyway: V1__schema.sql
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "unaccent";      -- busca sem acentuação
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- busca por similaridade de nome

-- ---------------------------------------------------------------------
-- 1. Tipos enumerados
-- ---------------------------------------------------------------------
CREATE TYPE escolaridade_enum   AS ENUM ('FUNDAMENTAL','MEDIO','SUPERIOR','POS_GRADUACAO');
CREATE TYPE estado_civil_enum   AS ENUM ('SOLTEIRO','CASADO','SEPARADO','DIVORCIADO','VIUVO');
CREATE TYPE cargo_enum          AS ENUM ('MEMBRO','COOPERADOR','DIACONO','MISSIONARIO','EVANGELISTA','PRESBITERO','PASTOR');
CREATE TYPE status_cadastro_enum AS ENUM ('PENDENTE','APROVADO','REPROVADO');
CREATE TYPE perfil_enum         AS ENUM ('ADMINISTRADOR','PASTOR','SECRETARIO','LIDER','MEMBRO');
CREATE TYPE notificacao_tipo_enum AS ENUM ('CADASTRO_APROVADO','CADASTRO_REPROVADO','CADASTRO_PENDENTE',
                                           'EVENTO','GRUPO','COMUNICADO');
CREATE TYPE canal_enum          AS ENUM ('PUSH','IN_APP','AMBOS');

-- ---------------------------------------------------------------------
-- 2. Igrejas (sede e congregações)
-- ---------------------------------------------------------------------
CREATE TABLE igreja (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome            VARCHAR(120) NOT NULL UNIQUE,
    cnpj            VARCHAR(18),
    endereco        VARCHAR(160),
    cidade          VARCHAR(80),
    uf              VARCHAR(2),
    sede            BOOLEAN NOT NULL DEFAULT FALSE,
    ativa           BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 3. Membros
-- ---------------------------------------------------------------------
CREATE TABLE membro (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_membro       VARCHAR(10) UNIQUE,             -- gerado na aprovação
    foto_url            VARCHAR(400) NOT NULL,          -- obrigatório (3x4 / 2x2)

    -- dados pessoais
    nome                VARCHAR(140) NOT NULL,
    data_nascimento     DATE         NOT NULL,
    naturalidade        VARCHAR(100) NOT NULL,
    rg                  VARCHAR(20),
    cpf                 VARCHAR(11)     NOT NULL UNIQUE,
    celular             VARCHAR(11)  NOT NULL,
    email               VARCHAR(140),
    profissao           VARCHAR(90),
    escolaridade        escolaridade_enum,
    estado_civil        estado_civil_enum,

    -- família
    nome_pai            VARCHAR(140), profissao_pai     VARCHAR(90),
    nome_mae            VARCHAR(140), profissao_mae     VARCHAR(90),
    nome_conjuge        VARCHAR(140), profissao_conjuge VARCHAR(90),

    -- endereço
    cep                 VARCHAR(8),
    logradouro          VARCHAR(160),
    numero              VARCHAR(12),
    complemento         VARCHAR(80),
    bairro              VARCHAR(90),
    cidade              VARCHAR(90),
    uf                  CHAR(2),

    -- vida eclesiástica
    data_batismo        DATE,
    nome_pastor         VARCHAR(140),
    igreja_id           UUID NOT NULL REFERENCES igreja(id),
    cargo               cargo_enum NOT NULL DEFAULT 'MEMBRO',
    dizimista           BOOLEAN NOT NULL DEFAULT FALSE,
    ofertante           BOOLEAN NOT NULL DEFAULT FALSE,

    -- fluxo de aprovação
    status              status_cadastro_enum NOT NULL DEFAULT 'PENDENTE',
    observacao          TEXT,                           -- justificativa de reprovação
    aprovado_por        UUID,                           -- FK usuario (definida abaixo)
    aprovado_em         TIMESTAMPTZ,
    ativo               BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em           TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
    versao              BIGINT NOT NULL DEFAULT 0,      -- @Version / resolução de conflito

    CONSTRAINT ck_membro_nascimento   CHECK (data_nascimento <= CURRENT_DATE),
    CONSTRAINT ck_membro_cpf          CHECK (cpf ~ '^[0-9]{11}$'),
    CONSTRAINT ck_membro_celular      CHECK (celular ~ '^[0-9]{10,11}$'),
    CONSTRAINT ck_membro_email        CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT ck_membro_cep          CHECK (cep IS NULL OR cep ~ '^[0-9]{8}$'),
    -- regra de negócio: casado exige nome do cônjuge
    CONSTRAINT ck_membro_conjuge      CHECK (estado_civil <> 'CASADO'
                                             OR (nome_conjuge IS NOT NULL AND length(btrim(nome_conjuge)) > 0)),
    -- aprovado exige número e data; reprovado exige justificativa
    CONSTRAINT ck_membro_aprovacao    CHECK (
        (status = 'APROVADO'  AND numero_membro IS NOT NULL AND aprovado_em IS NOT NULL)
     OR (status = 'REPROVADO' AND observacao IS NOT NULL)
     OR (status = 'PENDENTE'))
);
CREATE INDEX ix_membro_status  ON membro(status);
CREATE INDEX ix_membro_igreja  ON membro(igreja_id);
CREATE INDEX ix_membro_cargo   ON membro(cargo);
CREATE INDEX ix_membro_nome_tg ON membro USING gin (unaccent(nome) gin_trgm_ops);

-- filhos (inclusão dinâmica)
CREATE TABLE membro_filho (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membro_id       UUID NOT NULL REFERENCES membro(id) ON DELETE CASCADE,
    nome            VARCHAR(140) NOT NULL,
    data_nascimento DATE,
    CONSTRAINT ck_filho_nascimento CHECK (data_nascimento IS NULL OR data_nascimento <= CURRENT_DATE)
);
CREATE INDEX ix_filho_membro ON membro_filho(membro_id);

-- ---------------------------------------------------------------------
-- 4. Usuários e acesso (RBAC)
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login           VARCHAR(60) NOT NULL UNIQUE,
    email           VARCHAR(140) NOT NULL UNIQUE,
    senha_hash      VARCHAR(72) NOT NULL,               -- BCrypt (strength 12)
    nome            VARCHAR(140) NOT NULL,
    perfil          perfil_enum NOT NULL DEFAULT 'MEMBRO',
    membro_id       UUID UNIQUE REFERENCES membro(id) ON DELETE SET NULL,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acesso   TIMESTAMPTZ,
    senha_alterada_em TIMESTAMPTZ,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE membro ADD CONSTRAINT fk_membro_aprovador
    FOREIGN KEY (aprovado_por) REFERENCES usuario(id);

CREATE TABLE token_recuperacao (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    token_hash  VARCHAR(128) NOT NULL,
    expira_em   TIMESTAMPTZ NOT NULL,
    usado_em    TIMESTAMPTZ
);
CREATE INDEX ix_token_usuario ON token_recuperacao(usuario_id);

-- dispositivos para Firebase Cloud Messaging
CREATE TABLE dispositivo (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    fcm_token   VARCHAR(255) NOT NULL UNIQUE,
    plataforma  VARCHAR(20) NOT NULL,                   -- ANDROID | WEB
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- permissões explícitas (complementam o perfil)
CREATE TABLE permissao (
    id      SERIAL PRIMARY KEY,
    chave   VARCHAR(60) NOT NULL UNIQUE,                -- ex.: MEMBRO_APROVAR
    descricao VARCHAR(160) NOT NULL
);
CREATE TABLE perfil_permissao (
    perfil       perfil_enum NOT NULL,
    permissao_id INT NOT NULL REFERENCES permissao(id) ON DELETE CASCADE,
    PRIMARY KEY (perfil, permissao_id)
);

-- ---------------------------------------------------------------------
-- 5. Grupos
-- ---------------------------------------------------------------------
CREATE TABLE grupo (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(90) NOT NULL,
    descricao   VARCHAR(255),
    igreja_id   UUID REFERENCES igreja(id),
    lider_id    UUID REFERENCES membro(id) ON DELETE SET NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_grupo_nome_igreja UNIQUE (nome, igreja_id)
);

CREATE TABLE grupo_membro (
    grupo_id    UUID NOT NULL REFERENCES grupo(id)  ON DELETE CASCADE,
    membro_id   UUID NOT NULL REFERENCES membro(id) ON DELETE CASCADE,
    entrou_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (grupo_id, membro_id)
);
CREATE INDEX ix_grupo_membro_membro ON grupo_membro(membro_id);

-- ---------------------------------------------------------------------
-- 6. Eventos
-- ---------------------------------------------------------------------
CREATE TABLE evento (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo      VARCHAR(140) NOT NULL,
    data        DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim    TIME,
    igreja_id   UUID NOT NULL REFERENCES igreja(id),
    grupo_id    UUID REFERENCES grupo(id) ON DELETE SET NULL,   -- NULL = todos os membros
    endereco    VARCHAR(200),
    descricao   TEXT,
    criado_por  UUID REFERENCES usuario(id),
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    versao      BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT ck_evento_horario CHECK (hora_fim IS NULL OR hora_fim > hora_inicio)
);
CREATE INDEX ix_evento_data   ON evento(data);
CREATE INDEX ix_evento_grupo  ON evento(grupo_id);
CREATE INDEX ix_evento_igreja ON evento(igreja_id);
CREATE INDEX ix_evento_titulo ON evento USING gin (unaccent(titulo) gin_trgm_ops);

-- ---------------------------------------------------------------------
-- 7. Notificações
-- ---------------------------------------------------------------------
CREATE TABLE notificacao (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo        notificacao_tipo_enum NOT NULL,
    titulo      VARCHAR(140) NOT NULL,
    texto       TEXT,
    canal       canal_enum NOT NULL DEFAULT 'AMBOS',
    evento_id   UUID REFERENCES evento(id) ON DELETE CASCADE,
    grupo_id    UUID REFERENCES grupo(id)  ON DELETE CASCADE,
    criado_por  UUID REFERENCES usuario(id),
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notificacao_destinatario (
    notificacao_id UUID NOT NULL REFERENCES notificacao(id) ON DELETE CASCADE,
    usuario_id     UUID NOT NULL REFERENCES usuario(id)     ON DELETE CASCADE,
    lida_em        TIMESTAMPTZ,
    enviada_em     TIMESTAMPTZ,
    PRIMARY KEY (notificacao_id, usuario_id)
);
CREATE INDEX ix_notif_dest_nao_lida ON notificacao_destinatario(usuario_id) WHERE lida_em IS NULL;

-- ---------------------------------------------------------------------
-- 8. Sincronização offline e auditoria (LGPD)
-- ---------------------------------------------------------------------
CREATE TABLE fila_sincronizacao (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    entidade      VARCHAR(40) NOT NULL,          -- MEMBRO | EVENTO | GRUPO
    entidade_id   UUID,
    operacao      VARCHAR(10) NOT NULL,          -- CREATE | UPDATE | DELETE
    payload       JSONB NOT NULL,
    ocorrido_em   TIMESTAMPTZ NOT NULL,          -- carimbo do dispositivo (resolve conflito)
    processado_em TIMESTAMPTZ,
    conflito      BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX ix_fila_pendente ON fila_sincronizacao(usuario_id) WHERE processado_em IS NULL;

CREATE TABLE log_auditoria (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  UUID REFERENCES usuario(id),
    acao        VARCHAR(60) NOT NULL,            -- LOGIN, MEMBRO_APROVAR, EVENTO_EXCLUIR...
    entidade    VARCHAR(40),
    entidade_id UUID,
    antes       JSONB,
    depois      JSONB,
    ip          INET,
    user_agent  VARCHAR(255),
    ocorrido_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_auditoria_entidade ON log_auditoria(entidade, entidade_id);
CREATE INDEX ix_auditoria_data     ON log_auditoria(ocorrido_em DESC);

-- consentimento LGPD
CREATE TABLE consentimento_lgpd (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membro_id   UUID NOT NULL REFERENCES membro(id) ON DELETE CASCADE,
    finalidade  VARCHAR(120) NOT NULL,
    aceito      BOOLEAN NOT NULL,
    versao_termo VARCHAR(20) NOT NULL,
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 9. Gatilhos
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_touch() RETURNS trigger AS $$
BEGIN
    NEW.atualizado_em := now();
    NEW.versao := COALESCE(OLD.versao,0) + 1;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER tg_membro_touch BEFORE UPDATE ON membro
    FOR EACH ROW EXECUTE FUNCTION trg_touch();
CREATE TRIGGER tg_evento_touch BEFORE UPDATE ON evento
    FOR EACH ROW EXECUTE FUNCTION trg_touch();

-- número sequencial do membro, atribuído na aprovação
CREATE SEQUENCE seq_numero_membro START 1;
CREATE OR REPLACE FUNCTION trg_numero_membro() RETURNS trigger AS $$
BEGIN
    IF NEW.status = 'APROVADO' AND NEW.numero_membro IS NULL THEN
        NEW.numero_membro := lpad(nextval('seq_numero_membro')::text, 4, '0');
        NEW.aprovado_em   := COALESCE(NEW.aprovado_em, now());
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER tg_membro_numero BEFORE INSERT OR UPDATE ON membro
    FOR EACH ROW EXECUTE FUNCTION trg_numero_membro();

-- o líder do grupo precisa pertencer ao grupo
CREATE OR REPLACE FUNCTION trg_lider_no_grupo() RETURNS trigger AS $$
BEGIN
    IF NEW.lider_id IS NOT NULL THEN
        INSERT INTO grupo_membro(grupo_id, membro_id)
        VALUES (NEW.id, NEW.lider_id)
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER tg_grupo_lider AFTER INSERT OR UPDATE OF lider_id ON grupo
    FOR EACH ROW EXECUTE FUNCTION trg_lider_no_grupo();

-- ---------------------------------------------------------------------
-- 10. Visões para os relatórios
-- ---------------------------------------------------------------------
CREATE VIEW vw_membros_por_grupo AS
SELECT g.id AS grupo_id, g.nome AS grupo, count(gm.membro_id) AS total
FROM grupo g LEFT JOIN grupo_membro gm ON gm.grupo_id = g.id
WHERE g.ativo GROUP BY g.id, g.nome ORDER BY total DESC;

CREATE VIEW vw_faixa_etaria AS
SELECT CASE
         WHEN idade BETWEEN 0  AND 11 THEN '0-11'
         WHEN idade BETWEEN 12 AND 17 THEN '12-17'
         WHEN idade BETWEEN 18 AND 29 THEN '18-29'
         WHEN idade BETWEEN 30 AND 44 THEN '30-44'
         WHEN idade BETWEEN 45 AND 59 THEN '45-59'
         ELSE '60+' END AS faixa,
       count(*) AS total
FROM (SELECT date_part('year', age(data_nascimento))::int AS idade
      FROM membro WHERE status = 'APROVADO' AND ativo) t
GROUP BY faixa ORDER BY faixa;

CREATE VIEW vw_resumo_membros AS
SELECT count(*) FILTER (WHERE status='APROVADO' AND ativo)  AS ativos,
       count(*) FILTER (WHERE status='APROVADO' AND NOT ativo) AS inativos,
       count(*) FILTER (WHERE status='PENDENTE')            AS pendentes,
       count(*) FILTER (WHERE status='REPROVADO')           AS reprovados,
       count(*)                                             AS total
FROM membro;

CREATE VIEW vw_eventos_resumo AS
SELECT count(*) FILTER (WHERE data <  CURRENT_DATE) AS realizados,
       count(*) FILTER (WHERE data >= CURRENT_DATE) AS futuros,
       count(*) AS total
FROM evento;

-- ---------------------------------------------------------------------
-- 11. Carga inicial
-- ---------------------------------------------------------------------
INSERT INTO igreja (nome, sede, cidade, uf) VALUES
  ('IEPJCR — Sede', TRUE, 'São Paulo', 'SP'),
  ('IEPJCR — Congregação Jardim Aurora', FALSE, 'São Paulo', 'SP'),
  ('IEPJCR — Congregação Vila Nova', FALSE, 'São Paulo', 'SP');

INSERT INTO permissao (chave, descricao) VALUES
  ('MEMBRO_VER','Consultar membros'),
  ('MEMBRO_CRIAR','Cadastrar membros'),
  ('MEMBRO_EDITAR','Editar membros'),
  ('MEMBRO_APROVAR','Aprovar ou reprovar cadastros'),
  ('EVENTO_VER','Consultar eventos'),
  ('EVENTO_GERENCIAR','Cadastrar, editar e excluir eventos'),
  ('GRUPO_VER','Consultar grupos'),
  ('GRUPO_GERENCIAR','Criar, editar e desabilitar grupos'),
  ('GRUPO_LIDER','Promover e remover líderes'),
  ('GRUPO_MEMBROS','Associar e remover membros do grupo'),
  ('USUARIO_GERENCIAR','Gerenciar usuários e permissões'),
  ('RELATORIO_VER','Acessar relatórios'),
  ('NOTIFICACAO_ENVIAR','Enviar comunicados');

INSERT INTO perfil_permissao (perfil, permissao_id)
SELECT 'ADMINISTRADOR', id FROM permissao;

INSERT INTO perfil_permissao (perfil, permissao_id)
SELECT 'PASTOR', id FROM permissao WHERE chave <> 'USUARIO_GERENCIAR';

INSERT INTO perfil_permissao (perfil, permissao_id)
SELECT 'SECRETARIO', id FROM permissao
WHERE chave IN ('MEMBRO_VER','MEMBRO_CRIAR','MEMBRO_EDITAR','MEMBRO_APROVAR',
                'EVENTO_VER','EVENTO_GERENCIAR','GRUPO_VER','RELATORIO_VER','NOTIFICACAO_ENVIAR');

INSERT INTO perfil_permissao (perfil, permissao_id)
SELECT 'LIDER', id FROM permissao
WHERE chave IN ('MEMBRO_VER','EVENTO_VER','GRUPO_VER','GRUPO_MEMBROS','RELATORIO_VER');

INSERT INTO perfil_permissao (perfil, permissao_id)
SELECT 'MEMBRO', id FROM permissao WHERE chave IN ('EVENTO_VER','GRUPO_VER');

-- usuário administrador inicial (senha: trocar no primeiro acesso)
INSERT INTO usuario (login, email, nome, perfil, senha_hash)
VALUES ('admin','admin@iepjcr.org','Administração','ADMINISTRADOR',
        '$2a$12$e0MYzXyjpJS7Pd0RVvHwHe1HlPPbmVJ0S1B9tQvTCk1jJ5H7B2mFa');
