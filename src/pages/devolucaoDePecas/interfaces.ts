export interface iParamGetDevolucoes {
    dataInicio: string;
    dataFim: string;
}

export interface iDevolucao {
    NUM_DEVOLUCAO: number,
    NUM_ORCAMENTO: number,
    DATA: string,
    VALOR: number,
    NF_DEVOLUCAO: string,
    CREDITO: number,
    LOGIN: string,
    STATUS: 'ABERTA' | 'FINALIZADA'
}

export interface iGetDevolucoesResponse extends iDevolucao { }