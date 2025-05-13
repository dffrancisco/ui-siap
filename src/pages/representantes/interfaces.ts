export interface iRepresentantesParam {
    ID_REPRESENTANTE?: number;
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
    DELETADO?: string;
    DESCRICAO?: string;
}

export interface iMarcas {
    ID_MARCA: number;
    DESCRICAO: string;
    GRUPO: string;
    ID_MARCA_GRUPO: number;
}


export interface iCidades {
    COD_CIDADE: number;
    DESCRICAO: string;
    COD_IBGE: string
    CEP?: string;
}

export interface iParamGetRepresentantes {
    offset?: number;
    param: object;
}

export interface iGetDuplicityResponse {
    CEP?: number;
}

export interface iFieldDuplicity {
    value: string;
    field: string;

}

export interface iGetRepresentantes {
    ID_REPRESENTANTE?: number;
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
    DELETADO?: string;
    DESCRICAO?: string;
}

export interface iMarcasParam {
    ID_MARCA: number;
    DESCRICAO: string;
    GRUPO: string;
    ID_MARCA_GRUPO: number;
}
export interface iRepresentantes {
    ID_REPRESENTANTE: number
}

export interface iSearchMarcas {
    search: string;
}


export interface iToInativarFunction {
    DELELETADO: string;
    ID_FORNECEDOR: number;
}

export interface iGetFornecedoresResponse extends iRepresentantes { }
export interface iParamToInsert extends iRepresentantesParam { }
export interface iParamToUpdate extends iRepresentantesParam { }
