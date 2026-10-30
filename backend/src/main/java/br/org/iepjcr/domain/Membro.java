package br.org.iepjcr.domain;

import br.org.iepjcr.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "membro")
@Getter
@Setter
@NoArgsConstructor
public class Membro {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "numero_membro", unique = true, length = 10)
    private String numeroMembro;

    /** Obrigatório — foto 3x4 ou 2x2, conforme o documento de requisitos. */
    @Column(name = "foto_url", nullable = false, length = 400)
    private String fotoUrl;

    // --- dados pessoais ---
    @Column(nullable = false, length = 140)
    private String nome;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false, length = 100)
    private String naturalidade;

    private String rg;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, length = 11)
    private String celular;

    private String email;
    private String profissao;

    @Enumerated(EnumType.STRING)
    private Escolaridade escolaridade;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_civil")
    private EstadoCivil estadoCivil;

    // --- família ---
    @Column(name = "nome_pai")       private String nomePai;
    @Column(name = "profissao_pai")  private String profissaoPai;
    @Column(name = "nome_mae")       private String nomeMae;
    @Column(name = "profissao_mae")  private String profissaoMae;
    @Column(name = "nome_conjuge")   private String nomeConjuge;
    @Column(name = "profissao_conjuge") private String profissaoConjuge;

    @OneToMany(mappedBy = "membro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MembroFilho> filhos = new ArrayList<>();

    // --- endereço ---
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;

    // --- vida eclesiástica ---
    @Column(name = "data_batismo")
    private LocalDate dataBatismo;

    @Column(name = "nome_pastor")
    private String nomePastor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "igreja_id")
    private Igreja igreja;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Cargo cargo = Cargo.MEMBRO;

    private boolean dizimista;
    private boolean ofertante;

    // --- fluxo de aprovação ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCadastro status = StatusCadastro.PENDENTE;

    private String observacao;

    @ManyToOne
    @JoinColumn(name = "aprovado_por")
    private Usuario aprovadoPor;

    @Column(name = "aprovado_em")
    private Instant aprovadoEm;

    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    @Version
    private Long versao;

    @PreUpdate
    void aoAtualizar() {
        this.atualizadoEm = Instant.now();
    }
}
