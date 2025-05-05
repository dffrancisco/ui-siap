export interface iGetLojasResponse {
    NOME: string,
    CGC_CLIENTE: string,
    ID_SOCIEDADE: number
}

export interface iLojas extends iGetLojasResponse { }

export interface iGetProdutosEntreLojasParam {
    CNPJ: string,
    ANO: number,
    MES: number
}

export interface iGetProdutosEntreLojasResponseProdutos {
    COD_PRODUTO: number,
    DESC_PRODUTO: string,
    NUM_FABRICANTE: string,
    QTD: number
}
export interface iGetProdutosEntreLojasResponse {
    produtos: iGetProdutosEntreLojasResponseProdutos[],
    valorvalorTotalProdutos: number,
    error?: boolean,
    msg: boolean
}