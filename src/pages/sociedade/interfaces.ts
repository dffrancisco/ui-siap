export interface iSociedade {
    ID_SOCIEDADE: number;
    ID_CLIENTE: number;
    NOME: string;
    CAMINHO_SERVIDOR?: string;
    CNPJ: string;
    HOST?: string;
    BANCO: string;
    GERA_SPED: boolean;
    REGIME: string;
    FANTASIA?: string;
    ID_EMPRESA?: number;
}

export interface iCliente {
    ID_CLIENTE: number;
    CGC_CLIENTE: string;
    NOME: string;
}

export interface iGetClientes {
    search: string;
}

export interface iParamToInsert {
    ID_CLIENTE: number;
    ID_SOCIEDADE?: number;
    CAMINHO_SERVIDOR?: string;
    CNPJ: string;
    HOST?: string;
    BANCO: string;
    GERA_SPED: boolean;
    REGIME: string;
    FANTASIA?: string;
    ID_EMPRESA?: number;
}

export interface iUpdateSociedadeParam extends iParamToInsert { }

export interface iGetDuplicityResponse {
    CNPJ?: string;
}

export interface iFieldDuplicity {
    value: string;
    field: string;
}

export interface iToDeleteResponse {
    ID_SOCIEDADE: number;
    CNPJ: string;
}
