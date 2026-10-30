package br.org.iepjcr.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "evento")
@Getter
@Setter
@NoArgsConstructor
public class Evento {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 140)
    private String titulo;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fim")
    private LocalTime horaFim;

    @ManyToOne(optional = false)
    @JoinColumn(name = "igreja_id")
    private Igreja igreja;

    /** null = evento para todos os membros (regra do documento de requisitos). */
    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    private String endereco;

    @Column(columnDefinition = "text")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "criado_por")
    private Usuario criadoPor;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    @Version
    private Long versao;
}
