package br.org.iepjcr.dto.request;

import jakarta.validation.constraints.NotBlank;

/** identificador = CPF ou número de celular (regra: qualquer um dos dois loga). */
public record LoginRequest(
    @NotBlank String identificador,
    @NotBlank String senha
) { }
