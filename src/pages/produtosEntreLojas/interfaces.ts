export interface iGetLojasResponse {
    NOME: string,
    CGC_CLIENTE: string,
    ID_SOCIEDADE: number
}

export interface iLoja extends iGetLojasResponse { }

export interface iGetProdutosEntreLojasParam {
    CNPJ: string,
    ANO: number,
    MES: number
}

export interface iProduto {
    COD_PRODUTO: number,
    DESC_PRODUTO: string,
    NUM_FABRICANTE: string,
    QTD: number
}
export interface iGetProdutosEntreLojasResponse {
    produtos: iProduto[],
    valorvalorTotalProdutos: number,
    error?: boolean,
    msg: boolean
}

export interface iLojaFormatada {
    LOJA: string,
    VALOR_TOTAL: string,
    PRODUTOS: iProduto[],
    ID_SOCIEDADE: number
}

export interface iGetOrcamentosProdutoEntreLojasParam {
    CNPJ: string,
    ANO: number,
    MES: number,
    COD_PRODUTO: number
}

export interface iGetOrcamentosProdutoEntreLojasResponse {
    NUM_ORCAMENTO: number,
    DATA: string,
    QTO: number,
    error?: boolean,
    msg?: string
}

export interface iFilterSearch {
    loja: number,
    mes: number,
    ano: number
}