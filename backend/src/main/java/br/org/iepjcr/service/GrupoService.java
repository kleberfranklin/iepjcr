package br.org.iepjcr.service;

import br.org.iepjcr.domain.Grupo;
import br.org.iepjcr.domain.Membro;
import br.org.iepjcr.exception.ResourceNotFoundException;
import br.org.iepjcr.repository.GrupoRepository;
import br.org.iepjcr.repository.MembroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final MembroRepository membroRepository;

    public GrupoService(GrupoRepository grupoRepository, MembroRepository membroRepository) {
        this.grupoRepository = grupoRepository;
        this.membroRepository = membroRepository;
    }

    public List<Grupo> listar() {
        return grupoRepository.findAll();
    }

    @Transactional
    public Grupo criar(String nome, String descricao) {
        Grupo grupo = new Grupo();
        grupo.setNome(nome);
        grupo.setDescricao(descricao);
        return grupoRepository.save(grupo);
    }

    @Transactional
    public Grupo desabilitar(UUID id) {
        Grupo grupo = obter(id);
        grupo.setAtivo(!grupo.isAtivo());
        return grupoRepository.save(grupo);
    }

    /** Só Pastor(a)/Administrador chama este método (garantido por @PreAuthorize no controller).
     *  Promover um líder também o inclui automaticamente no grupo. */
    @Transactional
    public Grupo definirLider(UUID grupoId, UUID membroId) {
        Grupo grupo = obter(grupoId);
        if (membroId == null) {
            grupo.setLider(null);
        } else {
            Membro membro = membroRepository.findById(membroId)
                .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado."));
            grupo.setLider(membro);
            grupo.getMembros().add(membro);
        }
        return grupoRepository.save(grupo);
    }

    @Transactional
    public Grupo alternarMembro(UUID grupoId, UUID membroId) {
        Grupo grupo = obter(grupoId);
        Membro membro = membroRepository.findById(membroId)
            .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado."));
        if (grupo.getMembros().contains(membro)) {
            grupo.getMembros().remove(membro);
        } else {
            grupo.getMembros().add(membro);
        }
        return grupoRepository.save(grupo);
    }

    private Grupo obter(UUID id) {
        return grupoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado."));
    }
}
