export interface iResponseDadosInputs {
    nfeConfig: iNfeConfig[];
    regimeTributario: iRegimeTributario[];
    pis: iPis[];
    cofins: iCofins[];
}
export interface iCidades {
    COD_CIDADE: number;
    DESCRICAO: string;
    COD_IBGE: string;
    UF: string;
}

export interface iNfeConfig {
    ID_NFE_CONFIG: number;
    LOCAL_XML: string;
    LOCAL_PDF: string;
    REGIME_TRIBUTARIO: string;
    CFOP_TRANSP: string;
    CFOP_MONTAGEM_INTERNO: string;
    CFOP_MONTAGEM_INTERESTADUAL: string;
    EMIT_IM: number;
    EMIT_CNAE: number;
    PROD_CEST: string;
    CFOP_ECF_INTERNO: string;
    CFOP_ECF_INTERESTADUAL: string;
    CST: string;
    CFOP_DEV_INTERNO: string;
    CFOP_DEV_INTERESTADUAL: string;
    COD_LISTA_SERVICO: string;
    NCM_MONTAGEM_GERAL: string;
    PIS: string;
    COFINS: string;
}

export interface iInsertNfeConfigParam extends iNfeConfig { }

export interface iUpdateNfeConfig extends iNfeConfig { }

export interface iToDeleteResponse {
    delete: string;
}

export interface iFieldDuplicity {
    value: string;
    field: string;
}

export interface iGetDuplicityResponse {
    ID_NFE_CONFIG: string;
    LOCAL_XML: string;
}

export interface iRegimeTributario {
    ID_REGIME_TRIBUTARIO: number;
    DESCRICAO: string;
}

export interface iInsertRegimeTributario {
    DESCRICAO: string;
}

export interface iDeleteRegimeTributario {
    ID_REGIME_TRIBUTARIO: number;
}

export interface iPis {
    ID_PIS?: number;
    ID_REGIME_TRIBUTARIO?: string;
    P_VALOR?: number;
}

export interface iCofins {
    ID_COFINS: number;
    ID_REGIME_TRIBUTARIO: string;
    P_VALOR: number;
}

export interface iDuplicity {
    value: string;
    field: string;
}
