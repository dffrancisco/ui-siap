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
    HORA_FINALIZOU: string
    ID_FORNECEDOR: number
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

export interface iTransportadora {
    ID_TRANSPORTADORA: number,
    RAZAO_SOCIAL: string,
    TIPO_FRETE: number,
    VALOR_FRETE: number,
}

export interface iListaTransportadoras {
    ID_TRANSPORTADORA: number,
    RAZAO_SOCIAL: string,
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

export interface iParamFornecedorSelecionado {
    id_fornecedor: number
}

export interface iParamDevolucaoSelecionado {
    id_devolucao: number
}


export interface iGetDevolucoesResponse extends iDevolucao { }
export interface iDevolucaoSelecionadoResponse extends iDevolucao { }
export interface iGetFornecedoresResponse extends iFornecedor { }
export interface iFornecedorSelecionadoResponse extends iFornecedor { }
export interface iGetItensResponse extends iItem { }