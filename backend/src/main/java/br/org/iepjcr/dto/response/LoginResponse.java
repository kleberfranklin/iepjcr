package br.org.iepjcr.dto.response;

public record LoginResponse(String token, UsuarioResponse usuario) { }
