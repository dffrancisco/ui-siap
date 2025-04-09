export interface iRepresentantesParam {
    ID_REPRESENTANTE: number;
    NOME?: string;
    ENDERECO: string;
    BAIRRO: string;
    COD_CIDADE: number;
    CEP: string;
    TELEFONE: string;
    TELEFONE2: string;
    FAX: string;
    CELULAR: string;
    EMAIL: string;
    OBS: string;
    MARCAS: string;
}

export interface iMarcas {
    ID_MARCA: number;
    DESCRICAO: string;
    GRUPO: string;
    ID_MARCA_GRUPO: number;
}

export interface iParamGetRepresentantes {
    offset?: number;
    param: object;
}

export interface iGetDuplicityResponse {
    ID_REPRESENTANTE?: string;
}

export interface iFieldDuplicity {
    field: string;
    value: string;
}

export interface iGetRepresentantes {
    ID_REPRESENTANTE: number;
    NOME: string;
    ENDERECO: string;
    BAIRRO: string;
    COD_CIDADE: number;
    CEP: string;
    TELEFONE: string;
    TELEFONE2: string;
    FAX: string;
    CELULAR: string;
    EMAIL: string;
    OBS: string;
    MARCAS: string;
}

export interface iRepresentantes {
    search: string;
}


export interface iToInativarFunction {
    DELELETADO: string;
    ID_FORNECEDOR: number;
}

export interface iGetFornecedoresResponse extends iRepresentantes { }
export interface iParamToInsert extends iRepresentantesParam { }
export interface iParamToUpdate extends iRepresentantesParam { }
