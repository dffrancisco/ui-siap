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

export interface iVerDetalhesChamadoResponse {
    responsavel: string;
    comentarios: iDetalhesComentario[];
    prioridade: string;
    statusJira: string;
    descricao: string;
    solicitante: string;
    dataFormatada: string;
}

export interface iParamGetChamados {
    page: number;
    itemsPerPage: number;
    sortBy: string;
    search: string;
}

export interface iGetChamadosResponse {
    chamados: iChamados[];
    total: number;
}

export interface iInsertChamado {
    solicitante: string;
    loja: string;
    assunto: string;
    descricao: string;
    anexos: any[];
    dataAtual: string;
}

export interface iInsertChamadoResponse {
    solicitante: string;
    loja: string;
    assunto: string;
    descricao: string;
    anexos: any[];
    dataAtual: string;
}