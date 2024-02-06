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

export interface iParamAdicionarCargo {
    DESCRICAO: string,
    SALARIO: number,
}

export interface iParamInativarCargo {
    ID_CARGO: number,
    DELETADO: string
}

export interface iParamAlterarCargo extends iCargo {}

export interface iGetCargosResponse extends iCargo {}
export interface iAdicionarCargoResponse extends iCargo {}
export interface iAlterarCargoResponse extends iCargo {}
export interface iInativarCargoResponse extends iCargo {}