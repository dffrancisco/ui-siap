export interface iClientes {
    CGC_CLIENTE: string;
    CREDITO_USADO: number;
    ENDERECO: string;
    ID_CLIENTE: number;
    LIMITE_CREDITO: number;
    NOME: string;
    OBS: string;
    TELEFONE1: string;
}

export interface iGetClientes {
    search: string;
}