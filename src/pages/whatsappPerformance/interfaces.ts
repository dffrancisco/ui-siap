export interface iAtendimentoIniciado {
    nome: string,
    assigned_user: string,
    qtd_enviada: number,
    qtd_recebida: number,
    qtd_total: number
}

export interface iAtendimentoFinalizado {
    nome: string,
    assigned_user: string,
    qtd_enviada: number,
    qtd_recebida: number,
    qtd_total: number
}

export interface iTotalizadores {
    tagsAtendimento: [{
        tags: string,
        telefone: string
    }],
    qtdAds: number,
    tempoMedioEspera: string,
    tempoMedioAtendimento: string,
    conversasEncerradasSemAtendimento: number
}