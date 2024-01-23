export interface iProdutoMontagem {
    DESC_MONTAGEN: string;
    VALOR: any;
    ID_CARRO: number;
    ID_PRODUTO_MONTAGEM: number;
}

export interface iCarros {
    ID_CARRO: number;
    DESCRICAO: string;
}

export interface iGetInsertResponse {
    ID_PRODUTO_MONTAGEM: number;
}

export interface iParamGetProdutos {
    param: object;
    offset: number;
}

export interface iGetProdutosResponse extends iProdutoMontagem {}
export interface iParamToInsert extends iProdutoMontagem {}
export interface iParamToUpdate extends iProdutoMontagem {}