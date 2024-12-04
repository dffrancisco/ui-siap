export interface iFornecedores {
    idFornecedor: number;
    NOMEFORNECEDOR: string;
    CNPJ: string;
    IE: string;
    RAZAOSOCIAL: string;
    NOMEFANTASIA: string;
    TELEFONE: string;
    EMAIL: string;
    CEP: string;
    ENDERECO: string;
    BAIRRO: string;
    CIDADE: string;
    RAZAO_SOCIAL: string;
    NOME_FANTASIA: string;
    REPRESENTANTE: string;
    SITE: string;
    RESPONSAVEL: string;
    TELEFONE2: string;
    TELEFONE3: string;
    DATA_CADASTRO: Date;
    OBSERVACOES: string;
}

export interface iParamGetFornecedor {
    offset?: number;
    limit?: number;
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
    id: number;
    idFornecedor: number;
    NOMEFORNECEDOR: string;
    CNPJ: string;
    IE: string;
    RAZAOSOCIAL: string;
    NOMEFANTASIA: string;
    TELEFONE: string;
    EMAIL: string;
    CEP: string;
    ENDERECO: string;
    BAIRRO: string;
    CIDADE: string;
    RAZAO_SOCIAL: string;
    NOME_FANTASIA: string;
    REPRESENTANTE: string;
    SITE: string;
    RESPONSAVEL: string;
    TELEFONE2: string;
    TELEFONE3: string;
    DATA_CADASTRO: Date;
    OBSERVACOES: string;
}

export interface iParamToUpdate {
    idFornecedor: number;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    ie?: string;
    endereco: string;
    bairro: string;
    cidade: string;
    telefone1: string;
    telefone2?: string;
    telefone3?: string;
    email: string;
    site?: string;
    cep: string;
    value: any;
    observacoes?: string;
}

export interface iToDeleteResponse {
    idDeleted?: number;
}
