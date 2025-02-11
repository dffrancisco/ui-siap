export interface iSociedade {
    ID_SOCIEDADE?: number;
    ID_CLIENTE?: number;
    NOME?: string;
    CAMINHO_SERVIDOR?: string;
    ID_EMPRESA?: number;
    CNPJ?: string;
    HOST?: string;
    BANCO?: string;
    GERA_SPED?: boolean;
    REGIME?: string;
    FANTASIA?: string;
}

export interface iParamToInsert {
    ID_CLIENTE: number;
    NOME: string;
    CAMINHO_SERVIDOR: string;
    ID_EMPRESA: number;
    CNPJ: string;
    HOST: string;
    BANCO: string;
    GERA_SPED: boolean;
    REGIME: string;
    FANTASIA: string;
}

export interface iUpdateSociedadeParam {
    ID_CLIENTE: number;
    NOME: string;
    CAMINHO_SERVIDOR: string;
    ID_EMPRESA: number;
    CNPJ: string;
    HOST: string;
    BANCO: string;
    GERA_SPED: boolean;
    REGIME: string;
    FANTASIA: string;
}

export interface iGetDuplicityResponse {
    CNPJ: string;
}

export interface iFieldDuplicity {
    value: string;
    field: string;
}
export interface iParamGetSociedade {
    param: string;
    offset: number;
}

export interface iSociedadeResponse {
    sociedades: iSociedade[];
    total: number;
}

export interface iParamToUpdate {
    ID_SOCIEDADE: number;
    ID_CLIENTE: number;
    NOME: string;
    CAMINHO_SERVIDOR: string;
    ID_EMPRESA: number;
    CNPJ: string;
    HOST: string;
    BANCO: string;
    GERA_SPED: boolean;
    REGIME: string;
    FANTASIA: string;
}

export interface iInsertResponse {
    ID_SOCIEDADE: number;
    CNPJ: string;
}

export interface iToDeleteResponse {
    ID_SOCIEDADE: number;
    CNPJ: string;
}



export interface iSociedadeResponse extends iSociedade { }