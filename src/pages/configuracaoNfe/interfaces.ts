export interface iNfeConfig {
    ID_NFE_CONFIG: number;
    LOCAL_XML: string;
    LOCAL_PDF: string;
    REGIME_TRIBUTARIO: number;
    CFOP_TRANSP: string;
    CFOP_MONTAGEM_INTERNO: string;
    CFOP_MONTAGEM_INTERESTADUAL: string;
    EMIT_IM: string;
    EMIT_CNAE: string;
    PROD_CEST: string;
    CFOP_ECF_INTERNO: string;
    CFOP_ECF_INTERESTADUAL: string;
    CST: string;
    CFOP_DEV_INTERNO: string;
    CFOP_DEV_INTERESTADUAL: string;
    COD_LISTA_SERVICO: string;
    NCM_MONTAGEM_GERAL: string;
    PIS: number;
    COFINS: number;
    ID_EMPRESA?: number;
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
    ID_PIS: number;
    DESCRICAO: string;
    ALIQUOTA: number;
}

export interface iCofins {
    ID_COFINS: number;
    DESCRICAO: string;
    ALIQUOTA: number;
}

export interface iDuplicity {
    value: string;
    field: string;
}
