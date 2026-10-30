package br.org.iepjcr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record EventoRequest(
    @NotBlank String titulo,
    @NotNull LocalDate data,
    @NotNull LocalTime horaInicio,
    LocalTime horaFim,
    @NotNull UUID igrejaId,
    UUID grupoId,
    String endereco,
    String descricao
) { }
