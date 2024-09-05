export interface iCliente {
    ID_CLIENTE: number;
    CLIENTE: string;
    CNPJ: string;
    BLOQUEADO: number;
    CREDITO_USADO: string;
    FATURADO: string;
    LIMITE_CREDITO: string;
}

export interface iParamGetCliente {
    offset: number;
    param: object
}

export interface iGetClientesResponse extends iCliente { }
