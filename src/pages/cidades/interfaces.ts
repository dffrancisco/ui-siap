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

export interface iCidadeResponse extends iCidade { }

export interface iGetDuplicityResponse {
    COD_IBGE?: string;
    DESCRICAO?: string;
}

export interface iFieldDuplicity {
    value: string,
    field: string
}

export interface iParamToInsert {
    param: any
}

export interface iDiffToUpdate {
    diff: {
        old: object;
        new: object;
        diff: boolean
    }
}
