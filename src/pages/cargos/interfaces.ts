export interface iCargo {
    ID_CARGO: number,
    DESCRICAO: string,
    SALARIO: number,
    DELETADO: string
}

export interface iParamGetCargo {
    param: object,
    offset: number,
    checkbox: boolean
}

export interface iGetCargosResponse extends iCargo {}