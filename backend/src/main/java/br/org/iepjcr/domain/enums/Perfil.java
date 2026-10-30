package br.org.iepjcr.domain.enums;

/** Perfis de acesso (RBAC). Administrador e Pastor(a) enxergam tudo,
 *  exceto que Pastor(a) não acessa a tela de Configurações. */
public enum Perfil {
    ADMINISTRADOR,
    PASTOR,
    SECRETARIO,
    LIDER,
    MEMBRO
}
