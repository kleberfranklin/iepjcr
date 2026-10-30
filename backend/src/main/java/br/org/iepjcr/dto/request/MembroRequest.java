package br.org.iepjcr.dto.request;

import br.org.iepjcr.domain.enums.Cargo;
import br.org.iepjcr.domain.enums.Escolaridade;
import br.org.iepjcr.domain.enums.EstadoCivil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record MembroRequest(
    String foto,
    @NotBlank String nome,
    @NotNull LocalDate nascimento,
    @NotBlank String naturalidade,
    String rg,
    @NotBlank String cpf,
    @NotBlank String celular,
    String email,
    String profissao,
    Escolaridade escolaridade,
    EstadoCivil estadoCivil,
    String pai, String profPai,
    String mae, String profMae,
    String conjuge, String profConjuge,
    @Valid List<FilhoRequest> filhos,
    String cep, String endereco, String numeroEndereco, String complemento,
    String bairro, String cidade, String uf,
    LocalDate batismo, String pastor,
    UUID igrejaId,
    Cargo cargo,
    boolean dizimista,
    boolean ofertante
) {
    public record FilhoRequest(@NotBlank String nome, LocalDate nascimento) { }
}
