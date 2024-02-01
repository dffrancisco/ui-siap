export interface iBairro {
    ID_BAIRRO: number,
    DESCRICAO: string,
}

export interface iParamGetBairros {
    offset: number,
    param: object
}

export interface iGetBairrosResponse extends iBairro{}