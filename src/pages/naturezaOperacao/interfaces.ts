export interface iNaturezaOperacao {
    ID_NATUREZA_OPERACAO: number;
    DESCRICAO: string;
    CFOP: string;
}

export interface iGetNaturezaOperacaoParam {
    SEARCH: string;
}

export interface iGetNaturezaOperacaoGrid {
    param: iGetNaturezaOperacaoParam;
    offset: number
}

export interface iGetNaturezaOperacaoResponse extends iNaturezaOperacao { }

export interface iInsertNaturezaOperacaoParam {
    DESCRICAO: string;
    CFOP: string;
}

export interface iInsertNaturezaOperacaoResponse {
    ID_NATUREZA_OPERACAO: number;
}

export interface iGetDuplicidadeParam {
    field: string;
    value: any
}

export interface iGetDuplicidadeResponse {
    ID_NATUREZA_OPERACAO: number
}

export interface iUpdateNaturezaOperacaoParam extends iNaturezaOperacao { }

export interface iUpdateNaturezaOperacaoResponse {
    ok: string
}

export interface iDeleteNaturezaOperacaoResponse {
    ok: string
}