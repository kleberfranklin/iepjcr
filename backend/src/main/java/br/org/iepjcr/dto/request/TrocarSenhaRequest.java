package br.org.iepjcr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrocarSenhaRequest(
    @NotBlank String senhaAtual,
    @NotBlank @Size(min = 6, message = "a nova senha precisa de ao menos 6 caracteres") String novaSenha
) { }
