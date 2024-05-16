export interface iDevolucao {
    ID_DEVOLUCAO_FORNECEDOR: number,
    RAZAO_SOCIAL: string,
    CGC_FORNECEDOR: string,
    DATA: string,
    STATUS: number,
    NUM_NOTA_DEVOLUCAO: number,
    VALOR: number,
    CHAVE_DEVOLUCAO: string,
    LOGIN: string,
    HORA_FINALIZOU: string,
    ID_FORNECEDOR: number,
    ID_TRANSPORTADORA: number,
    NOME_TRANSPORTADORA: string,
    VALOR_FRETE: number,
    TIPO_FRETE: number,
    ID_DEVOLUCAO_FORNECEDOR_TRANSP: number,
    UF: string
}

export interface iItem {
    ID_DEVOLUCAO_FORNECEDOR_ITEM: number,
    ID_ENTRADA?: number,
    ID_ITEM?: number,
    DESCRICAO: string,
    NUM_NOTA: number,
    QUANTIDADE: number,
    COD_FABRICANTE: string,
    CUSTO?: number,
    COD_PRODUTO: number
    VALOR_ICMS_ST: number,
    CST: string,
    BASE_ICMS_ST: number,
    PERCENTUAL_ICMS: number,
    PERCENTUAL_IPI: number,
    UF?: string,
    CHAVE: string,
    DATA_EMISSAO: string,
    QTD: number,
    CST_PIS: string,
    CST_COFINS: string,
    PERCENTUAL_PIS: number,
    PERCENTUAL_COFINS: number,
    CST_IPI: string
}

export interface iItemDevolucao {
    ID_DEVOLUCAO_FORNECEDOR: number
    ID_ENTRADA: number,
    ID_ITEM: number,
    CFOP: string,
    QTD: number,
    CST: string,
    VALOR_UNITARIO: number,
    VALOR_ICMS_ST: number,
    BASE_ICMS_ST: number,
    PERCENTUAL_ICMS: number,
    PERCENTUAL_IPI: number | string,
    CST_PIS: string,
    PERCENTUAL_PIS: number | string,
    CST_COFINS: string,
    PERCENTUAL_COFINS: number | string,
    COD_FABRICANTE: string,
    CHAVE: string,
    DATA_EMISSAO: string,
    CST_IPI: string,
    PERCENTUAL_REDUCAO_BASE_ICMS: number | string,
}

export interface iItensDevolucao {
    ID_DEVOLUCAO_FORNECEDOR_ITEM: number,
    ID_DEVOLUCAO_FORNECEDOR: number,
    ID_NF_ENTRADA_MANIFESTO: number,
    ID_NF_ENTRADA_ITEM: number,
    QTD: number,
    VALOR_UNITARIO: number,
    VALOR_TOTAL: number,
    DESCRICAO: string,
    NUM_NOTA: number,
    DATA_EMISSAO: string,
    QUANTIDADE: number,
    COD_FABRICANTE: string,
    COD_PRODUTO: number
    VALOR_ICMS_ST: number,
    CST: string,
    BASE_ICMS_ST: number,
    PERCENTUAL_ICMS: number,
    PERCENTUAL_IPI: number,
    CHAVE: string,
    CST_PIS: string,
    CST_COFINS: string,
    PERCENTUAL_PIS: number,
    PERCENTUAL_COFINS: number,
    CST_IPI: string,
}

export interface iFornecedor {
    ID_FORNECEDOR: number,
    CGC_FORNECEDOR: string,
    RAZAO_SOCIAL: string
}

export interface iTranspordadoraDevolucao {
    ID_DEVOLUCAO_FORNECEDOR_TRANSP: number,
    ID_DEVOLUCAO_FORNECEDOR: number,
    ID_TRANSPORTADORA: number,
    NOME_TRANSPORTADORA: string,
    TIPO_FRETE: number,
    VALOR_FRETE: number,
    ESPECIE: string,
    QTD: number,
    PESO_LIQUIDO: number,
    PESO_BRUTO: number,
    AUTORIZACAO_CORREIOS: string,
}

export interface iListaTransportadoras {
    ID_TRANSPORTADORA: number,
    NOME_TRANSPORTADORA: string,
}

export interface iGridQuery {
    offset: number,
    param: object
}

export interface iParamGetDevolucoes extends iGridQuery { }

export interface iParamGetFornecedores extends iGridQuery { }

export interface iParamGetItens extends iGridQuery { }

export interface iParamInsertTransportadoraDevolucao extends iTranspordadoraDevolucao { }

export interface iParamUpdateTransportadoraDevolucao extends iTranspordadoraDevolucao { }

export interface iParamUpdateInsertItemDevolucao {
    param: object
}

export interface iParamFinalizarDevolucao {
    param: object
}

export interface objNotasAgrupadas {
    [key: number]: iItensDevolucao
}

export interface iParamGetTributosItemNota {
    ANO: number,
    MES: string,
    CHAVE: string,
    COD_FABRICANTE: string
}

export interface iTributosItem {
    CST_PIS: string,
    PERCENTUAL_PIS: number,
    CST_COFINS: string,
    PERCENTUAL_COFINS: number
    CST_IPI: string,
    PERCENTUAL_IPI: number,
    PERCENTUAL_REDUCAO_BASE_ICMS: number
}

export interface iGetTributosItemNotaResponse extends iTributosItem { }
export interface iBaixarNFeEntradaGetTributosItemNotaResponse extends iTributosItem { }

export interface iParamGetItensDevolucaoQTDFunction {
    ID_NF_ENTRADA_MANIFESTO: number,
    ID_NF_ENTRADA_ITEM: number
}

export interface iGetItensDevolucaoQTDResponse {
    QTD: number
}

export interface iParamEmitirNotaDevolucaoFornecedorPrevia {
    ID_DEVOLUCAO_FORNECEDOR: number,
    PREVIA: boolean
}

export interface iEmitirNotaDevolucaoFornecedorPreviaResponse {
    pdf: string,
    xml: string
}

export interface iParamBaixarNFeEntradaGetTributosItemNota {
    CHAVE: string,
    COD_FABRICANTE: string
}

export interface iGetDevolucoesResponse extends iDevolucao { }
export interface iGetFornecedoresResponse extends iFornecedor { }
export interface iGetItensResponse extends iItem { }
export interface iInsertTransportadoraResponse extends iTranspordadoraDevolucao { }
export interface iUpdateTransportadoraResponse extends iTranspordadoraDevolucao { }
export interface iUpdateInsertItemDevolucaoResponse extends iItemDevolucao { }
export interface iFinalizarDevolucaoResponse extends iDevolucao { }