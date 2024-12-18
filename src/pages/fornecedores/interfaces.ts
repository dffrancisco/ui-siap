export interface iFornecedores {
    idFornecedor: number;
    id: number;
    CGC_FORNECEDOR: string;
    RAZAO_SOCIAL: string;
    NOME_FANTAZIA: string;
    INSC_ESTADUAL?: string;
    ENDERECO: string;
    CONTADO: string;
    MUNICIPIO: number;
    BAIRRO: string;
    TELEFONE1: string;
    TELEFONE2?: string;
    DELETADO?: string;
    FAX?: string;
    CEP?: string;
    HOME_PAGE?: string;
    EMAIL?: string;
    OBS?: string;
    CADASTRO: Date;
    ID_EMPRESA?: number;
    ID_REPRESENTANTE: number;
    NOME: string;
    DESCRICAO: string;
}

export interface iParamGetFornecedor {
    offset?: number;
    limit?: number;
    checkboxAtiva: boolean;
    param: {
        razaoSocial?: string;

        deletado?: boolean;
        cnpj?: string;
        cidade?: string;
    };
}

export interface iGetDuplicityResponse {
    value: string;
    field: string;
}

export interface iInsertResponse {
    idFornecedor: number;
    id: number;
    CGC_FORNECEDOR: string;
    RAZAO_SOCIAL: string;
    NOME_FANTAZIA: string;
    INSC_ESTADUAL?: string;
    ENDERECO: string;
    CONTADO: string;
    MUNICIPIO: number;
    BAIRRO: string;
    TELEFONE1: string;
    TELEFONE2?: string;
    DELETADO?: string;
    FAX?: string;
    CEP?: string;
    HOME_PAGE?: string;
    EMAIL?: string;
    OBS?: string;
    CADASTRO: Date;
    ID_EMPRESA?: number;
    ID_REPRESENTANTE: number;
    NOME: string;
    DESCRICAO: string;
}

export interface iParamToUpdate {
    idFornecedor: number;
    id: number;
    CGC_FORNECEDOR: string;
    RAZAO_SOCIAL: string;
    NOME_FANTAZIA: string;
    INSC_ESTADUAL?: string;
    ENDERECO: string;
    CONTADO: string;
    MUNICIPIO: number;
    BAIRRO: string;
    TELEFONE1: string;
    TELEFONE2?: string;
    DELETADO?: string;
    FAX?: string;
    CEP?: string;
    HOME_PAGE?: string;
    EMAIL?: string;
    OBS?: string;
    CADASTRO: Date;
    ID_EMPRESA?: number;
    ID_REPRESENTANTE: number;
    NOME: string;
    DESCRICAO: string;
}

export interface iToDeleteResponse {
    idDeleted?: number;
}

export interface iFieldDuplicity {
    field: string;
    value: string;
}

export interface iParamGetRepresentante {
    ID_REPRESENTANTE: number;
    NOME: string;
    EMAIL: string;
    TELEFONE: number;
}

export interface iRepresentantes {
    ID_REPRESENTANTE: number;
    NOME: string;
    EMAIL: string;
    TELEFONE: number;
}

export interface iGetDadosParaInputs {
    DESCRICAO: string;
}