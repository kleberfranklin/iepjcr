package br.org.iepjcr.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey chave;
    private final long expiracaoMinutos;

    public JwtService(
        @Value("${app.jwt.secret}") String segredo,
        @Value("${app.jwt.expiracao-minutos}") long expiracaoMinutos
    ) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes());
        this.expiracaoMinutos = expiracaoMinutos;
    }

    public String gerar(UUID usuarioId, String perfil) {
        Instant agora = Instant.now();
        return Jwts.builder()
            .subject(usuarioId.toString())
            .claim("perfil", perfil)
            .issuedAt(Date.from(agora))
            .expiration(Date.from(agora.plus(expiracaoMinutos, ChronoUnit.MINUTES)))
            .signWith(chave)
            .compact();
    }

    public UUID extrairUsuarioId(String token) {
        String subject = Jwts.parser().verifyWith(chave).build()
            .parseSignedClaims(token).getPayload().getSubject();
        return UUID.fromString(subject);
    }

    public boolean valido(String token) {
        try {
            Jwts.parser().verifyWith(chave).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
