package br.org.iepjcr.domain;

import br.org.iepjcr.domain.enums.Perfil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true, length = 60)
    private String login;

    @Column(nullable = false, unique = true, length = 140)
    private String email;

    /** Hash BCrypt — nunca armazenar a senha em texto puro.
     *  @JsonIgnore é uma segunda camada de proteção: mesmo que algum endpoint
     *  volte a serializar Usuario diretamente (ex.: via Evento.criadoPor),
     *  este campo nunca sai na resposta. */
    @JsonIgnore
    @Column(name = "senha_hash", nullable = false, length = 72)
    private String senhaHash;

    @Column(nullable = false, length = 140)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil = Perfil.MEMBRO;

    @OneToOne
    @JoinColumn(name = "membro_id")
    private Membro membro;

    private boolean ativo = true;

    @Column(name = "ultimo_acesso")
    private Instant ultimoAcesso;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();
}
