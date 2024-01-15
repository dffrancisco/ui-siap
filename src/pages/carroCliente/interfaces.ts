export interface iCarroCliente {
    PLACA: any,
    MODELO: string,
    ANO: any,
    DATA: string,
    COR: string
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

export interface iFieldDuplicity {
    value: string,
    field: string
}

export interface iParamToInsert {
    param: any
}

export interface iDiffToUpdate {
    diff: {
        old: object;
        new: object;
        diff: boolean
    }
}

export interface iCarroClienteResponse extends iCarroCliente { }