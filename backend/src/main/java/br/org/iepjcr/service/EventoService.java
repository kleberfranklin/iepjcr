package br.org.iepjcr.service;

import br.org.iepjcr.domain.Evento;
import br.org.iepjcr.domain.enums.Perfil;
import br.org.iepjcr.dto.request.EventoRequest;
import br.org.iepjcr.exception.BusinessException;
import br.org.iepjcr.exception.ResourceNotFoundException;
import br.org.iepjcr.repository.EventoRepository;
import br.org.iepjcr.repository.GrupoRepository;
import br.org.iepjcr.repository.IgrejaRepository;
import br.org.iepjcr.security.UsuarioAutenticado;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final IgrejaRepository igrejaRepository;
    private final GrupoRepository grupoRepository;
    private final NotificacaoService notificacaoService;

    public EventoService(
        EventoRepository eventoRepository, IgrejaRepository igrejaRepository,
        GrupoRepository grupoRepository, NotificacaoService notificacaoService
    ) {
        this.eventoRepository = eventoRepository;
        this.igrejaRepository = igrejaRepository;
        this.grupoRepository = grupoRepository;
        this.notificacaoService = notificacaoService;
    }

    /** Membro só vê eventos "para todos" ou do(s) grupo(s) a que pertence;
     *  os demais perfis veem tudo, com filtros opcionais de data/grupo. */
    public List<Evento> listar(LocalDate de, LocalDate ate, UUID grupoId, UsuarioAutenticado usuarioAutenticado) {
        var usuario = usuarioAutenticado.getUsuario();
        if (usuario.getPerfil() == Perfil.MEMBRO && usuario.getMembro() != null) {
            return eventoRepository.buscarVisiveisParaMembro(usuario.getMembro().getId());
        }
        return eventoRepository.buscar(de, ate, grupoId);
    }

    public Evento obter(UUID id) {
        return eventoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado."));
    }

    @Transactional
    public Evento criar(EventoRequest req) {
        Evento evento = new Evento();
        aplicarDados(evento, req);
        Evento salvo = eventoRepository.save(evento);
        notificacaoService.notificarNovoEvento(salvo);
        return salvo;
    }

    @Transactional
    public Evento atualizar(UUID id, EventoRequest req) {
        Evento evento = obter(id);
        aplicarDados(evento, req);
        return eventoRepository.save(evento);
    }

    @Transactional
    public void excluir(UUID id) {
        eventoRepository.delete(obter(id));
    }

    private void aplicarDados(Evento e, EventoRequest req) {
        if (req.horaFim() != null && !req.horaFim().isAfter(req.horaInicio())) {
            throw new BusinessException("O horário de término deve ser depois do início.");
        }
        e.setTitulo(req.titulo());
        e.setData(req.data());
        e.setHoraInicio(req.horaInicio());
        e.setHoraFim(req.horaFim());
        e.setIgreja(igrejaRepository.findById(req.igrejaId())
            .orElseThrow(() -> new ResourceNotFoundException("Igreja não encontrada.")));
        e.setGrupo(req.grupoId() != null
            ? grupoRepository.findById(req.grupoId())
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado."))
            : null);
        e.setEndereco(req.endereco());
        e.setDescricao(req.descricao());
    }
}
