export interface iConhecimento {
    ID_CONHECIMENTO: number;
    DESCRICAO: string;
    VALOR: number;
}

export interface iInsertConhecimentoParam {
    ID_CONHECIMENTO: number;
    DESCRICAO: string;
    VALOR: number;
    ID_EMPRESA?: number;
}

export interface iUpdateConhecimento {
    ID_CONHECIMENTO: number;
    DESCRICAO: string;
    VALOR: number;
    ID_EMPRESA?: number;
}

export interface iToDeleteResponse {
    delete: string
}