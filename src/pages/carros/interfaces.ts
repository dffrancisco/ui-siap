export interface iCarro {
    ID_CARRO: number;
    DESCRICAO: string;
    ID_MONTADORA: number;
    MONTADORA: string;
}

export interface iMontadora {
    DESCRICAO: string;
    ID_MONTADORA: number;
}

export interface iParamGetCarros {
    param: object;
    offset: number;
}

export interface iGetInsertResponse {
    ID_CARRO: number;
}

export interface iGetDuplicityResponse {
    DESCRICAO?: string;
}

export interface iFieldDuplicity {
    value: string,
    field: string
}

export interface iCarroResponse extends iCarro { }
export interface iParamToInsert extends iCarro { }
export interface iParamToUpdate extends iCarro { }
