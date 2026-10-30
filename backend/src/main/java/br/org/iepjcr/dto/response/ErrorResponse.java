package br.org.iepjcr.dto.response;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(String message, Instant timestamp, Map<String, String> campos) {
    public static ErrorResponse de(String message) {
        return new ErrorResponse(message, Instant.now(), null);
    }
    public static ErrorResponse deCampos(String message, Map<String, String> campos) {
        return new ErrorResponse(message, Instant.now(), campos);
    }
}
