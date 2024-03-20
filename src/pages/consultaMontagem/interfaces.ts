export interface iMontagem {
    ID_MONTADOR?: number;
    LOGIN: string;
    VALOR: number;
    DEVOLUCAO: number;
    VALOR_TOTAL: number;
}

export interface iParamGetRelatorioMontagens {
    dataInicio: string;
    dataFim: string;
}

export interface iGetRelatorioMontagensResponse extends iMontagem { }