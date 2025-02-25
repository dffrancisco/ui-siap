export interface iClientesFaturados {
    BLOQUEADO: number;
    CLIENTE: string;
    CNPJ: string;
    CREDITO_USADO: number;
    DESCONTO_MONTAGEM: string;
    DIA_VENCIMENTO_BOLETO: number | null;
    DIVIDIR_BOLETO: string | null;
    FATURADO: string
    ID_CLIENTE: number;
    LIMITE_CREDITO: number;
    TIPO_FATURAMENTO: string | null;
}

export interface iGetClientesFaturados {
    search: string;
}
