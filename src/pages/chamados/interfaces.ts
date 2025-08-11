export interface iChamados {
    ID_CHAMADO: number;
    KEY_JIRA: string;
    SOLICITANTE: string;
    ASSUNTO: string;
    DESCRICAO: string;
    DATA_CRIACAO: string;
    dataFormatada: string;
    GRUPO_EMAIL: string;
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
    cnpj: string;
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
    usuario: string;
}

export interface iInsertChamado {
    solicitante: string;
    loja: string;
    assunto: string;
    descricao: string;
    anexos: string[];
    dataAtual: string;
}

export interface iInsertChamadoResponse {
    solicitante: string;
    loja: string;
    assunto: string;
    descricao: string;
    anexos: string[];
    dataAtual: string;
    chaveJira: string;
    cnpj: string;
    grupoEmail: string;
}

export interface IDadosRhAdmissao {
    gerente: null | string,
    motivo: null | string,
    complementoMotivo: null | string,
    vaga: null | string,
    quantidade: null | number,
    complementoVaga: null | string
}