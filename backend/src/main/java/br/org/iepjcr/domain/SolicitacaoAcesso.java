package br.org.iepjcr.domain;

import br.org.iepjcr.domain.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

/** Pré-cadastro público (Nome completo + celular). Ver comentário na migração V2. */
@Entity
@Table(name = "solicitacao_acesso")
@Getter
@Setter
@NoArgsConstructor
public class SolicitacaoAcesso {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 140)
    private String nome;

    @Column(nullable = false, length = 11)
    private String celular;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status = StatusSolicitacao.PENDENTE;

    @ManyToOne
    @JoinColumn(name = "membro_id")
    private Membro membro;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "resolvido_em")
    private Instant resolvidoEm;
}
