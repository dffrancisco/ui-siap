export interface iParamGetDevolucoes {
    dataInicio: string;
    dataFim: string;
    page: number;
}

export interface iDevolucao {
    NUM_DEVOLUCAO: number,
    NUM_ORCAMENTO: number,
    DATA: string,
    VALOR: number,
    NF_DEVOLUCAO: string,
    CREDITO: number,
    LOGIN: string
}

export interface iGetDevolucoesResponse extends iDevolucao { }