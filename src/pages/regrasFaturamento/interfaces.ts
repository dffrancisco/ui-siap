export interface iRegraFaturamento {
    ID_REGRA_FATURAMENTO: number,
    FATURAMENTO_ATE_VALOR: number | string,
    FATURAMENTO_ATE_PRAZO_1: number,
    FATURAMENTO_ATE_PRAZO_2: number,
    FATURAMENTO_ATE_PRAZO_3: number,
    FATURAMENTO_ACIMA_DE_VALOR: number | string,
    FATURAMENTO_ACIMA_DE_PRAZO_1: number,
    FATURAMENTO_ACIMA_DE_PRAZO_2: number,
    FATURAMENTO_ACIMA_DE_PRAZO_3: number,
    ID_CLIENTE?: number
}

export interface iGetRegraFaturamentoResponse extends iRegraFaturamento { }