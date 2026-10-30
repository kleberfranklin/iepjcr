package br.org.iepjcr.service;

import br.org.iepjcr.domain.SolicitacaoAcesso;
import br.org.iepjcr.domain.Usuario;
import br.org.iepjcr.dto.request.LoginRequest;
import br.org.iepjcr.dto.request.PreCadastroRequest;
import br.org.iepjcr.dto.response.LoginResponse;
import br.org.iepjcr.dto.response.UsuarioResponse;
import br.org.iepjcr.repository.SolicitacaoAcessoRepository;
import br.org.iepjcr.repository.UsuarioRepository;
import br.org.iepjcr.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final SolicitacaoAcessoRepository solicitacaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UsuarioRepository usuarioRepository,
        SolicitacaoAcessoRepository solicitacaoRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /** Login por CPF ou número de celular (regra de negócio), com o login/e-mail
     *  clássico como alternativa para as contas administrativas de demonstração. */
    public LoginResponse login(LoginRequest req) {
        String identificador = somenteDigitos(req.identificador());

        Usuario usuario = usuarioRepository
            .findByMembro_CpfOrMembro_Celular(identificador, identificador)
            .or(() -> usuarioRepository.findByLogin(req.identificador()))
            .or(() -> usuarioRepository.findByEmail(req.identificador()))
            .orElseThrow(RuntimeException::new);

        if (!usuario.isAtivo() || !passwordEncoder.matches(req.senha(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("credenciais inválidas");
        }

        String token = jwtService.gerar(usuario.getId(), usuario.getPerfil().name());
        return new LoginResponse(token, UsuarioResponse.de(usuario));
    }

    /** Pré-cadastro: só nome + celular. Fica pendente até a secretaria completar
     *  o cadastro em "membro" (tela Novo Cadastro, pré-preenchida). */
    @Transactional
    public void preCadastro(PreCadastroRequest req) {
        SolicitacaoAcesso solicitacao = new SolicitacaoAcesso();
        solicitacao.setNome(req.nome());
        solicitacao.setCelular(somenteDigitos(req.celular()));
        solicitacaoRepository.save(solicitacao);
        // TODO: notificar pastor/secretaria (mesmo canal usado em NotificacaoService).
    }

    private String somenteDigitos(String v) {
        return v == null ? null : v.replaceAll("\\D", "");
    }
}
