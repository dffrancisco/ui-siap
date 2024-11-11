export interface iImpressorasTermicas {
    ID_IMPRESSORA: number;
    IP: string;
    LOCAL: string;
    CARROSSEL: string;
    STATUS: string;
    QTO_IMP: number;
    PORTA: number;
    DRIVER: string;
    CAIXA: string;
}

export interface iDrivers{
    DRIVER: string;
    STATUS: string;
}

export interface iParamGetImpressorasTermicas{
    offset: number;
    param: object;
}

export interface iFieldDuplicity{
    field: string
    value: string
}

export interface iGetDuplicityResponse{
    ID_IMPRESSORA?: number
    IP: string
}

export interface iParamToInsert {
    param: any
}

export interface iParamToUpdate extends iImpressorasTermicas{}

export interface iImpressorasTermicasResponse extends iImpressorasTermicas {
    STATUS: string;
}