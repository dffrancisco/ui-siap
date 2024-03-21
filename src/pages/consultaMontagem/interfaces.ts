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

export interface iParamGetMontagemInf {
    param: object;
}

export interface iMontagemInf {
    VALOR: number,
    DATA: string,
    NUM_ORCAMENTO: number,
    PLACA: string,
    VENDEDOR: string
}

export interface iGetDevolucaoInfResponse {
    NUM_ORCAMENTO: number,
    PLACA: string,
    VALOR: number,
    DATA_VENDA: string,
    DATA: string
}

export interface iParamGetDevolucaoInf extends iParamGetMontagemInf { }
export interface iGetRelatorioMontagensResponse extends iMontagem { }
export interface iGetMontagemInfResponse extends iMontagemInf { }

