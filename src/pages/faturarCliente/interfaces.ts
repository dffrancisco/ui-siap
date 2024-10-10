export interface iClienteFaturado {
    ID_CLIENTE: number,
    NOME: string,
    CGC_CLIENTE: string,
    OBS_CLIENTE: string,
    DIVIDIR_BOLETO: "S" | 'N',
    DIA_VENCIMENTO_BOLETO: number,
    TIPO_FATURAMENTO: "Q" | 'M'
}

export interface iGetClientesFaturadosResponse extends iClienteFaturado { }

export interface iGetClientesFaturadosParam {
    search: string,
    dataLimite: string
}

export interface iOrcamentosClienteFaturado {
    NUM_ORCAMENTO: number,
    NUM_NFE: number,
    NOME: string,
    DATA: string,
    DEVOLUCAO: number,
    VALOR: number,
    NUM_DEVOLUCAO: number,
    MONTAGEM: number,
}

export interface iOrcamentosLocalizados extends iOrcamentosClienteFaturado {
    ISDEVOLUCAO?: boolean
}

export interface iGetOrcamentosClienteFaturadoResponse extends iOrcamentosClienteFaturado { }

export interface iGetOrcamentosClienteFaturadoParam {
    dataLimite: string,
    id_cliente: number
}

export interface iRegraFaturamento {
    ID_REGRA_FATURAMENTO: number,
    FATURAMENTO_ATE_VALOR: number,
    FATURAMENTO_ATE_PRAZO_1: number,
    FATURAMENTO_ATE_PRAZO_2: number,
    FATURAMENTO_ATE_PRAZO_3: number,
    FATURAMENTO_ACIMA_DE_VALOR: number,
    FATURAMENTO_ACIMA_DE_PRAZO_1: number,
    FATURAMENTO_ACIMA_DE_PRAZO_2: number,
    FATURAMENTO_ACIMA_DE_PRAZO_3: number
}

export interface iRegraFaturamentoParcela {
    ID_REGRA_FATURAMENTO_PARCELA: number,
    FATURAMENTO_ATE_VALOR: number,
    FATURAMENTO_ACIMA_DE_VALOR: number,
    DIVISAO: number
}

export interface iGetRegrasFaturamentoResponse {
    regrasFaturamento: iRegraFaturamento[];
    regrasFaturamentoParcelas: iRegraFaturamentoParcela[];
}

export interface iBoleto {
    DATA_VENCIMENTO: string,
    VALOR: number,
}

export interface iGerarBoletosParam {
    ID_CLIENTE: number,
    BOLETOS: iBoleto[],
    ORCAMENTOS: iOrcamentosClienteFaturado[]
}

export interface iResponseSuccess {
    success: boolean,
    msg: string
}

export interface iGerarBoletosResponse extends iResponseSuccess { }