export interface iCorredor {
    ID: number;
    DESCRICAO: string;
    LOCALIDADE: string;
}

export interface iLocalidade {
    LOCALIDADE: string
}

export interface iParamGetCorredores{
    offset: number;
    param: object;
}

export interface iParamToInsert{
    param: any
}

export interface iFieldDuplicity{
    field: string
    value: string
}

export interface iGetDuplicityResponse{
    ID?: number
    DESCRICAO: string
}

export interface iCorredorResponse {}

export interface iParamToUpdate{
        ID: number
        DESCRICAO: string
        LOCALIDADE: string
}