package br.org.iepjcr.controller;

import br.org.iepjcr.dto.request.LoginRequest;
import br.org.iepjcr.dto.request.PreCadastroRequest;
import br.org.iepjcr.dto.response.LoginResponse;
import br.org.iepjcr.dto.response.UsuarioResponse;
import br.org.iepjcr.security.UsuarioAutenticado;
import br.org.iepjcr.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/pre-cadastro")
    public ResponseEntity<Void> preCadastro(@Valid @RequestBody PreCadastroRequest req) {
        authService.preCadastro(req);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/me")
    public UsuarioResponse me(@AuthenticationPrincipal UsuarioAutenticado principal) {
        return UsuarioResponse.de(principal.getUsuario());
    }
}
