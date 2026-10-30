package br.org.iepjcr.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "membro_filho")
@Getter
@Setter
@NoArgsConstructor
public class MembroFilho {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "membro_id")
    private Membro membro;

    @Column(nullable = false, length = 140)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;
}
