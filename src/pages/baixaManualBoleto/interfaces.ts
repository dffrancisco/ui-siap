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

export interface iOrcamento {
    NUM_ORCAMENTO: number;
    NUM_NFE: number;
    NOME: string;
    DATA: string;
    DEVOLUCAO: number;
    VALOR: number;
    NUM_DEVOLUCAO: number;
    MONTAGEM: number;
    checked?: boolean;
}

export interface iBoleto {
    NUM_BOLETO: number;
    VALOR: number;
    DATA_PROCESSAMENTO: string;
    DATA_VENCIMENTO: string;
    DIVISAO: string;
    checked?: boolean;
}