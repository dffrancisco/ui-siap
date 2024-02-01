export interface iBairro {
    ID_BAIRRO: number,
    DESCRICAO: string,
}

export interface iParamGetBairros {
    offset: number,
    param: object
}

export interface iParamDuplicity {
    field: string,
    value: string
}

export interface iGetDuplicidadeResponse {
    DESCRICAO: string
}

export interface iParamToInsert {
    DESCRICAO: string
}

export interface iGetBairrosResponse extends iBairro{}
export interface iToInsertResponse extends iBairro{}
export interface iParamToUpdate extends iBairro{}
export interface iToUpdateResponse extends iBairro{}