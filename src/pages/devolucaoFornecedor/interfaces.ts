export interface iDevolucao {
    ID_DEVOLUCAO_FORNECEDOR: number,
    RAZAO_SOCIAL: string,
    CGC_FORNECEDOR: string,
    DATA: string,
    STATUS: number,
    NUM_NOTA_DEVOLUCAO: number,
    VALOR: number,
    CHAVE_DEVOLUCAO: string
}

export interface iParamGetDevolucoes {
    offset: number,
    param: object
}

export interface iGetDevolucoesResponse extends iDevolucao { }