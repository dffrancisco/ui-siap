export interface iResponseDadosInputs {
    nfeConfig: iNfeConfig[];
    regimeTributario: iRegimeTributario[];
    pis: iPis[];
    cofins: iCofins[];
}

export interface iNfeConfig {
    ID_NFE_CONFIG: number;
    LOCAL_XML: string;
    LOCAL_PDF: string;
    REGIME_TRIBUTARIO: string;
    CFOP_TRANSP: string;
    CFOP_MONTAGEM_INTERNO: string;
    CFOP_MONTAGEM_INTERESTADUAL: number;
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
}

export interface iUpdateNfeConfig extends iNfeConfig { }

export interface iRegimeTributario {
    ID_REGIME_TRIBUTARIO?: number;
    DESCRICAO?: string;
}

export interface iPis {
    ID_PIS?: number;
    P_VALOR?: number;
    ID_REGIME_TRIBUTARIO?: number;
}

export interface iCofins {
    ID_COFINS?: number;
    P_VALOR?: number;
    ID_REGIME_TRIBUTARIO?: number;
}

export interface updatePayload {
    nfeConfig: iNfeConfig;
    pis: iPis;
    cofins: iCofins;
};