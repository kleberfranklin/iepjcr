package br.org.iepjcr.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "igreja")
@Getter
@Setter
@NoArgsConstructor
public class Igreja {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true, length = 120)
    private String nome;

    private String cidade;

    @Column(length = 2)
    private String uf;

    private boolean sede;

    private boolean ativa = true;
}
