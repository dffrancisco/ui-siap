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
    ID_DEVOLUCAO_FORNECEDOR_TRANSP: number
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
    DATA_EMISSAO: string
}

export interface iFornecedor {
    ID_FORNECEDOR: number,
    CGC_FORNECEDOR: string,
    RAZAO_SOCIAL: string
}

export interface iItem {
    ID_ENTRADA: number,
    ID_ITEM: number,
    DESCRICAO: string,
    NUM_NOTA: number,
    QUANTIDADE: number,
    COD_FABRICANTE: string,
    CUSTO: number,
    COD_PRODUTO: number
    CFOP: string
}

export interface iTranspordadoraDevolucao {
    ID_DEVOLUCAO_FORNECEDOR_TRANSP: number,
    ID_DEVOLUCAO_FORNECEDOR: number,
    ID_TRANSPORTADORA: number,
    NOME_TRANSPORTADORA: string,
    TIPO_FRETE: number,
    VALOR_FRETE: number,
}

export interface iListaTransportadoras {
    ID_TRANSPORTADORA: number,
    NOME_TRANSPORTADORA: string,
}

export interface iParamGetDevolucoes {
    offset: number,
    param: object
}

export interface iParamGetFornecedores {
    offset: number,
    param: object
}

export interface iParamGetItens {
    offset: number,
    param: object
}

export interface iParamInsertTransportadoraDevolucao {
    param: object
}

export interface iParamUpdateTransportadoraDevolucao {
    param: object
}

export interface iGetDevolucoesResponse extends iDevolucao { }
export interface iGetFornecedoresResponse extends iFornecedor { }
export interface iGetItensResponse extends iItem { }
export interface iInsertTransportadoraResponse extends iTranspordadoraDevolucao { }
export interface iUpdateTransportadoraResponse extends iTranspordadoraDevolucao { }