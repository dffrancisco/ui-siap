export interface iFornecedor {
    CGC_FORNECEDOR: string;
    RAZAO_SOCIAL: string;
    NOME_FANTAZIA: string;
    INSC_ESTADUAL: string;
    ENDERECO: string;
    COD_CIDADE: number;
    BAIRRO: string;
    TELEFONE1: string;
    TELEFONE2: string;
    ID_REPRESENTANTE: number;
    CONTADO: string;
    MUNICIPIO: string;
    FAX?: string;
    CEP?: string;
    HOME_PAGE: string;
    EMAIL: string;
    OBS?: string;
    CADASTRO: string;
    DELETADO: string;
    ID_EMPRESA: number;
    ID_FORNECEDOR: number;
    NOME?: string;
    DESCRICAO?: string;
    COD_IBGE?: string;
    TELEFONE?: number;


}


export interface iParamGetFornecedor {
    offset?: number;
    param: object;
    checkboxAtiva?: boolean;

}

export interface iGetDuplicityResponse {
    CGC_FORNECEDORES?: string;
}

export interface iFieldDuplicity {
    field: string;
    value: string;
}

export interface iRepresentantes {
    ID_REPRESENTANTE: number;
    NOME: string;
    EMAIL: string;
    TELEFONE: number;
}

export interface iCidades {
    COD_CIDADE: number;
    DESCRICAO: string;
    COD_IBGE: string
    CEP?: string;
}

export interface iToInativarFunction {
    DELELETADO: string;
    ID_FORNECEDOR: number;
}

export interface iGetFornecedoresResponse extends iFornecedor { }
export interface iParamToInsert extends iFornecedor { }
export interface iParamToUpdate extends iFornecedor { }
