export interface iCargo {
    ID_CARGO: number,
    DESCRICAO: string,
    SALARIO: number,
    DELETADO: string
}

export interface iParamGetCargo {
    param: object,
    offset: number
}