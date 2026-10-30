-- Pré-cadastro público (tela "Cadastre-se": Nome completo + Número de celular).
-- Fica separado de "membro" porque o cadastro completo (foto, CPF, endereço,
-- dados eclesiásticos...) só é preenchido depois, pela secretaria/pastor,
-- ao transformar a solicitação em um registro em "membro".
CREATE TYPE status_solicitacao_enum AS ENUM ('PENDENTE', 'CONVERTIDA', 'DESCARTADA');

CREATE TABLE solicitacao_acesso (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome         VARCHAR(140) NOT NULL,
    celular      VARCHAR(11)  NOT NULL,
    status       status_solicitacao_enum NOT NULL DEFAULT 'PENDENTE',
    membro_id    UUID REFERENCES membro(id),   -- preenchido quando convertida
    criado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolvido_em TIMESTAMPTZ,
    CONSTRAINT ck_solicitacao_celular CHECK (celular ~ '^[0-9]{10,11}$')
);
CREATE INDEX ix_solicitacao_status ON solicitacao_acesso(status);

-- Login por CPF OU celular (regra de negócio): índice para acelerar a busca
-- feita por UsuarioRepository.findByMembro_CpfOrMembro_Celular.
CREATE INDEX ix_membro_celular ON membro(celular);
