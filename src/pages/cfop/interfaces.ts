export interface iCfop {
    CFOP: string;
    DESCRICAO: string;
    VALOR: number;
    UF: string;
}

export interface iParamToInsertCfop {
    CFOP: string;
    DESCRICAO: string;
    VALOR: number;
    UF: string;
}

export interface iParamGetCfop {
    offset: number;
    param: {
        CFOP?: string;
        DESCRICAO?: string;
        UF?: string;
    };
}

export interface iInsertResponse {
    CFOP: string;
}

export interface iGetDuplicityResponse {
    CFOP?: string;
    DESCRICAO?: string;
    UF?: string;
}

export interface iFieldDuplicity {
    value: string;
    field: string;
}

export interface iCfopResponse extends iCfop { }

export interface iParamToUpdateCfop extends iCfop { }

export interface iToDeleteResponse {
    delete: string;
}
