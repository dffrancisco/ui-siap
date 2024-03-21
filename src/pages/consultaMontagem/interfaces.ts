export interface iMontagem {
    ID_MONTADOR?: number;
    LOGIN: string;
    VALOR: number;
    DEVOLUCAO: number;
    VALOR_TOTAL: number;
}

export interface iGridParam {
    param: object;
    offset: number;
}

export interface iParamGetRelatorioMontagens {
    dataInicio: string;
    dataFim: string;
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

export interface iParamGetGraficoMes {
    dataInicio: string,
    dataFim: string,
    ID_MONTADOR: number
}

export interface iGraficoMes {
    VALOR: number,
    DATA: string,
    DIA: string
}

export interface iParamGetMontagemInf extends iGridParam { }
export interface iParamGetDevolucaoInf extends iGridParam { }
export interface iParamGetDevolucaoInf extends iGridParam { }
export interface iGetRelatorioMontagensResponse extends iMontagem { }
export interface iGetMontagemInfResponse extends iMontagemInf { }
export interface iGetGraficoMesResponse extends iGraficoMes { }