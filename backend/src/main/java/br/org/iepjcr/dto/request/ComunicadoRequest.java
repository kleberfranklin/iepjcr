package br.org.iepjcr.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ComunicadoRequest(@NotBlank String titulo, String texto) { }
