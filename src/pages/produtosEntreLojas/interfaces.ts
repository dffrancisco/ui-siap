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
    PRODUTOS: iProduto[]
}