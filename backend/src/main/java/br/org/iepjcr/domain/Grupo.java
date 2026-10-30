package br.org.iepjcr.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "grupo")
@Getter
@Setter
@NoArgsConstructor
public class Grupo {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 90)
    private String nome;

    private String descricao;

    @ManyToOne
    @JoinColumn(name = "igreja_id")
    private Igreja igreja;

    /** Só o Pastor(a) — ou o Administrador — pode alterar este campo (regra de negócio). */
    @ManyToOne
    @JoinColumn(name = "lider_id")
    private Membro lider;

    @ManyToMany
    @JoinTable(
        name = "grupo_membro",
        joinColumns = @JoinColumn(name = "grupo_id"),
        inverseJoinColumns = @JoinColumn(name = "membro_id")
    )
    private Set<Membro> membros = new HashSet<>();

    private boolean ativo = true;
}
