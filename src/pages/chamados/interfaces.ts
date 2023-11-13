export interface iChamados {
    ID_CHAMADO: number;
    KEY_JIRA: string;
    SOLICITANTE: string;
    ASSUNTO: string;
    DESCRICAO: string;
    DATA_CRIACAO: string;
    dataFormatada: string;
}

export interface iDetalhesComentario {
    autor: string;
    criacao: string;
    texto: string;
}

export interface iDetalhes {
    responsavel: string;
    comentarios: iDetalhesComentario[];
    prioridade: string;
    statusJira: string;
    descricao: string;
    solicitante: string;
    dataFormatada: string;
}