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

export interface iFieldDuplicity {
    value: string;
    field: string;
}

export interface iGetDuplicityResponse {
    ID_CONHECIMENTO: string;
    DESCRICAO: string;
}