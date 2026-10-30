package br.org.iepjcr.exception;

/** Violação de regra de negócio (ex.: cônjuge obrigatório se casado, CPF duplicado). */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
