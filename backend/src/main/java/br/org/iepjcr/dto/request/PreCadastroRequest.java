package br.org.iepjcr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Pré-cadastro público: só nome e celular. O restante é completado pela secretaria. */
public record PreCadastroRequest(
    @NotBlank String nome,
//    @NotBlank @Pattern(regexp = "\\d{10,11}", message = "celular deve ter DDD + número, só dígitos")
    String celular
) { }
