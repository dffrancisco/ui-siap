export interface iCarroCliente {
    PLACA: any,
    MODELO: string,
    ANO: any,
    DATA: string,
    COR: string,
}

export interface iModelos {
    DESCRICAO: string;
}

export interface iParamGetCarroCliente {
    offset: number,
    param: object
}

export interface iGetDuplicityResponse {
    PLACA?: string;
}

export interface iGetInsertResponse {
    DATA: string;
}

export interface iFieldDuplicity {
    value: string,
    field: string
}

export interface iParamToInsert extends iCarroCliente { }
export interface iParamToUpdate extends iCarroCliente { }
export interface iCarroClienteResponse extends iCarroCliente { }