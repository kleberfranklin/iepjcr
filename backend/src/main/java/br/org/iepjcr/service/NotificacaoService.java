package br.org.iepjcr.service;

import br.org.iepjcr.domain.Evento;
import br.org.iepjcr.domain.Membro;
import br.org.iepjcr.domain.Notificacao;
import br.org.iepjcr.domain.enums.NotificacaoTipo;
import br.org.iepjcr.repository.NotificacaoRepository;
import org.springframework.stereotype.Service;

/**
 * Centraliza a criação de notificações in-app e o disparo via Firebase Cloud
 * Messaging (push). O envio efetivo ao FCM fica fora do escopo deste esqueleto —
 * ver o SDK "firebase-admin" já declarado no pom.xml.
 */
@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    public void notificarLiderancaNovoCadastro(Membro membro) {
        salvar(NotificacaoTipo.CADASTRO_PENDENTE, "Novo cadastro para análise",
            membro.getNome() + " enviou um cadastro de membro.", null, null);
    }

    public void notificarMembro(Membro membro, String titulo, String texto) {
        var tipo = titulo.toLowerCase().contains("aprovado")
            ? NotificacaoTipo.CADASTRO_APROVADO : NotificacaoTipo.CADASTRO_REPROVADO;
        salvar(tipo, titulo, texto, null, null);
        // TODO: resolver o destinatário (Usuario do membro) e enviar push via FCM.
    }

    public void notificarNovoEvento(Evento evento) {
        String alvo = evento.getGrupo() != null ? evento.getGrupo().getNome() : "todos os membros";
        salvar(NotificacaoTipo.EVENTO, "Novo evento: " + evento.getTitulo(),
            evento.getData() + " às " + evento.getHoraInicio() + " — " + alvo,
            evento, evento.getGrupo());
    }

    public void enviarComunicado(String titulo, String texto) {
        salvar(NotificacaoTipo.COMUNICADO, titulo, texto, null, null);
    }

    private void salvar(NotificacaoTipo tipo, String titulo, String texto,
                         Evento evento, br.org.iepjcr.domain.Grupo grupo) {
        Notificacao n = new Notificacao();
        n.setTipo(tipo);
        n.setTitulo(titulo);
        n.setTexto(texto);
        n.setEvento(evento);
        n.setGrupo(grupo);
        notificacaoRepository.save(n);
    }
}
