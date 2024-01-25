export interface iTranspordadoras{
    ID_TRANSPORTADORA: number;
    RAZAO_SOCIAL: string;
    CGC_TRANSPORTADORA: string;
    INSC_ESTADUAL: string;
    ENDERECO: string;
    BAIRRO: string;
    CEP: string;
    TELEFONE1: string;
    TELEFONE2: string;
    EMAIL: string;
    OBS: string;
    DELETADO: string;

    COD_CIDADE: number;
    CIDADE: string;
}

export interface iCidades {
    COD_CIDADE: number;
    DESCRICAO: string;
}

export interface iParamGetTransportadoras {
    param: object;
    offset: number;
    checkboxAtiva: boolean;
}

export interface iFieldDuplicity {
    field: string;
    value: string;
}

export interface iGetDuplicityResponse {
    CGC_TRANSPORTADORA?: string;
}

export interface iGetInsertResponse {
    ID_TRANSPORTADORA: number;
}

export interface iGetTransportadorasResponse extends iTranspordadoras{}
export interface iParamToInsert extends iTranspordadoras{}
export interface iParamToUpdate extends iTranspordadoras{}
