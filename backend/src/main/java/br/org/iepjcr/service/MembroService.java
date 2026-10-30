package br.org.iepjcr.service;

import br.org.iepjcr.domain.*;
import br.org.iepjcr.domain.enums.EstadoCivil;
import br.org.iepjcr.domain.enums.Perfil;
import br.org.iepjcr.domain.enums.StatusCadastro;
import br.org.iepjcr.dto.request.MembroRequest;
import br.org.iepjcr.exception.BusinessException;
import br.org.iepjcr.exception.ResourceNotFoundException;
import br.org.iepjcr.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class MembroService {

    private final MembroRepository membroRepository;
    private final MembroFilhoRepository filhoRepository;
    private final IgrejaRepository igrejaRepository;
    private final GrupoRepository grupoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificacaoService notificacaoService;

    public MembroService(
        MembroRepository membroRepository, MembroFilhoRepository filhoRepository,
        IgrejaRepository igrejaRepository, GrupoRepository grupoRepository,
        UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
        NotificacaoService notificacaoService
    ) {
        this.membroRepository = membroRepository;
        this.filhoRepository = filhoRepository;
        this.igrejaRepository = igrejaRepository;
        this.grupoRepository = grupoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificacaoService = notificacaoService;
    }

    public List<Membro> listar(String busca, StatusCadastro status) {
        return membroRepository.buscar(busca, status);
    }

    public Membro obter(UUID id) {
        return membroRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado."));
    }

    public List<Grupo> gruposDoMembro(UUID membroId) {
        return grupoRepository.findByMembros_Id(membroId);
    }

    @Transactional
    public Membro criar(MembroRequest req) {
        Membro membro = new Membro();
        aplicarDados(membro, req);
        membro.setStatus(StatusCadastro.PENDENTE);
        Membro salvo = membroRepository.save(membro);
        notificacaoService.notificarLiderancaNovoCadastro(salvo);
        return salvo;
    }

    @Transactional
    public Membro atualizar(UUID id, MembroRequest req) {
        Membro membro = obter(id);
        aplicarDados(membro, req);
        return membroRepository.save(membro);
    }

    /** Aprova o cadastro e, pela regra "todo membro aprovado tem acesso ao app",
     *  cria a conta de usuário dele caso ainda não exista.
     *  O número do membro (numero_membro) e aprovado_em são preenchidos
     *  automaticamente por trigger no banco (ver V1__schema.sql). */
    @Transactional
    public Membro aprovar(UUID id) {
        Membro membro = obter(id);
        membro.setStatus(StatusCadastro.APROVADO);
        membro.setObservacao(null);
        Membro salvo = membroRepository.save(membro);

        usuarioRepository.findByMembro_CpfOrMembro_Celular(salvo.getCpf(), salvo.getCelular())
            .ifPresentOrElse(
                usuario -> { /* já tem acesso — nada a fazer */ },
                () -> criarAcessoParaMembro(salvo)
            );

        notificacaoService.notificarMembro(salvo, "Cadastro aprovado",
            "Seu cadastro foi aprovado. A carteirinha digital já está disponível no aplicativo.");
        return salvo;
    }

    @Transactional
    public Membro reprovar(UUID id, String observacao) {
        if (observacao == null || observacao.isBlank()) {
            throw new BusinessException("Informe uma justificativa para reprovar o cadastro.");
        }
        Membro membro = obter(id);
        membro.setStatus(StatusCadastro.REPROVADO);
        membro.setObservacao(observacao);
        Membro salvo = membroRepository.save(membro);
        notificacaoService.notificarMembro(salvo, "Cadastro reprovado", observacao);
        return salvo;
    }

    private void criarAcessoParaMembro(Membro membro) {
        Usuario usuario = new Usuario();
        usuario.setNome(membro.getNome());
        usuario.setLogin(membro.getCpf());
        usuario.setEmail(membro.getEmail() != null ? membro.getEmail() : membro.getCpf() + "@iepjcr.org");
        // Senha inicial: 4 últimos dígitos do celular + CPF — o membro troca no primeiro acesso.
        String senhaInicial = "iepjcr" + membro.getCelular().substring(membro.getCelular().length() - 4);
        usuario.setSenhaHash(passwordEncoder.encode(senhaInicial));
        usuario.setPerfil(Perfil.MEMBRO);
        usuario.setMembro(membro);
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
        // TODO: enviar a senha inicial por SMS/e-mail em vez de apenas gerar.
    }

    private void aplicarDados(Membro m, MembroRequest req) {
        if (req.estadoCivil() == EstadoCivil.CASADO
                && (req.conjuge() == null || req.conjuge().isBlank())) {
            throw new BusinessException("Nome do cônjuge é obrigatório quando o estado civil é Casado.");
        }
        membroRepository.findByCpf(req.cpf())
            .filter(existente -> !existente.getId().equals(m.getId()))
            .ifPresent(existente -> {
                throw new BusinessException("Já existe um cadastro com este CPF: " + existente.getNome());
            });

        m.setFotoUrl(req.foto());
        m.setNome(req.nome());
        m.setDataNascimento(req.nascimento());
        m.setNaturalidade(req.naturalidade());
        m.setRg(req.rg());
        m.setCpf(req.cpf());
        m.setCelular(req.celular());
        m.setEmail(req.email());
        m.setProfissao(req.profissao());
        m.setEscolaridade(req.escolaridade());
        m.setEstadoCivil(req.estadoCivil());
        m.setNomePai(req.pai());
        m.setProfissaoPai(req.profPai());
        m.setNomeMae(req.mae());
        m.setProfissaoMae(req.profMae());
        m.setNomeConjuge(req.conjuge());
        m.setProfissaoConjuge(req.profConjuge());
        m.setCep(req.cep());
        m.setLogradouro(req.endereco());
        m.setNumero(req.numeroEndereco());
        m.setComplemento(req.complemento());
        m.setBairro(req.bairro());
        m.setCidade(req.cidade());
        m.setUf(req.uf());
        m.setDataBatismo(req.batismo());
        m.setNomePastor(req.pastor());
        if (req.igrejaId() != null) {
            m.setIgreja(igrejaRepository.findById(req.igrejaId())
                .orElseThrow(() -> new ResourceNotFoundException("Igreja não encontrada.")));
        }
        if (req.cargo() != null) m.setCargo(req.cargo());
        m.setDizimista(req.dizimista());
        m.setOfertante(req.ofertante());

        m.getFilhos().clear();
        if (req.filhos() != null) {
            req.filhos().forEach(f -> {
                MembroFilho filho = new MembroFilho();
                filho.setMembro(m);
                filho.setNome(f.nome());
                filho.setDataNascimento(f.nascimento());
                m.getFilhos().add(filho);
            });
        }
    }
}
