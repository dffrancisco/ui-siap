export interface iClientesFaturados {
    CLIENTE: string;
    CNPJ: string;
    ID_CLIENTE: number;
}

export interface iGetClientesFaturados {
    search: string;
}

export interface iParamGetOrcamentos {
    ID_CLIENTE: number;
    CNPJ: string;
}