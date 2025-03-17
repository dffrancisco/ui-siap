export interface iClienteFaturado {
    ID_CLIENTE: number,
    NOME: string,
    CGC_CLIENTE: string,
    OBS_CLIENTE: string,
    DIVIDIR_BOLETO: "S" | 'N',
    DESCONTO_MONTAGEM: "S" | 'N',
    DIA_VENCIMENTO_BOLETO: number,
    TIPO_FATURAMENTO: "Q" | 'M' | 'D',
    ID_REGRA_FATURAMENTO: number
}

export interface iGetClientesFaturadosResponse extends iClienteFaturado { }

export interface iGetClientesFaturadosParam {
    search?: string,
    dataLimite?: string,
    contorno?: boolean
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

export interface iCreditoCliente {
    ID_CREDITO: number,
    ID_DEVOLUCAO: number,
    VALOR: number,
    DATA_VENDA: string,
    NUM_ORCAMENTO: number,
}

export interface iDevolucaoFiltered {
    NUM_ORCAMENTO: number,
    DATA: string,
    VALOR: number,
    CREDITO: 'N' | 'S',
}
export interface iOrcamentosLocalizados extends iOrcamentosClienteFaturado {
    IS_DEVOLUCAO?: boolean
}

export interface iGetOrcamentosClienteFaturadoResponse extends iOrcamentosClienteFaturado { }
export interface iGetCreditosClienteResponse extends iCreditoCliente { }

export interface iGetOrcamentosClienteFaturadoParam {
    dataLimite: string,
    id_cliente: number,
    cnpj: string
}

export interface iGetCreditosClienteParam {
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

export interface iGetRegrasFaturamentoGeralResponse extends iRegrasFaturamentoGeral { }

export interface iBoleto {
    DATA_VENCIMENTO: string,
    VALOR: number,
}

export interface iGerarBoletosParam {
    BOLETOS: iBoleto[],
    ID_CLIENTE: number,
    DATA_LIMITE: string,
    REGRAS_FATURAMENTO: iRegrasFaturamentoGeral,
    BOLETO_CONFERIDO: boolean,
    VALOR_CONFERIDO: number,
}

export interface iResponseSuccess {
    success: boolean,
    msg: string
}

export interface iGerarBoletosResponse extends iResponseSuccess { }

export interface iRegrasFaturamentoGeral {
    regrasFaturamento: iRegraFaturamento,
    regrasFaturamentoParcelas: iRegraFaturamentoParcela[]
}

export interface iGerRegrasFaturamentoExclusivoResponse extends iRegraFaturamento { }