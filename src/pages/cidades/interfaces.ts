export interface iCidade {
    COD_IBGE: string;
    DESCRICAO: string;
    COD_CIDADE: number;
    UF: string;
}

export interface iUF {
    SIGLA: string;
}

export interface iParamGetCidades {
    offset: number;
    param: object;
}

export interface iInsertResponse {
    COD_CIDADE: number;
}

export interface iGetDuplicityResponse {
    COD_IBGE?: string;
    DESCRICAO?: string;
}

export interface iFieldDuplicity {
    value: string,
    field: string
}

export interface iCidadeResponse extends iCidade { }
export interface iParamToInsert extends iCidade { }
export interface iParamToUpdate extends iCidade { }
