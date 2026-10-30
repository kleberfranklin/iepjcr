package br.org.iepjcr.dto.request;

/** observacao é obrigatória apenas na reprovação (validado no service). */
public record DecisaoAprovacaoRequest(String observacao) { }
