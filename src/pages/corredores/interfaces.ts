export interface iCorredor {
    ID: number;
    DESCRICAO: string;
    LOCALIDADE: string;
    ID_EMPRESA: number
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

export interface iDiffToUpdate{
    diff:{
        old: object;
        new: object;
        diff: boolean
    }
}