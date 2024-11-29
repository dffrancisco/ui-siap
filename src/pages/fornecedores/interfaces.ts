export interface iFornecedores {
    idFornecedor: number;
    cdBanco: string;
    cdAgencia: string;
    nrConta: string;
    nomeFornecedor: string;
    CNPJ: string;
    IE: string;
    RAZAO_SOCIAL: string;
    NOME_FANTASIA: string;
    TELEFONE: string;
    EMAIL: string;
    CEP: string;
    ENDERECO: string;
    BAIRRO: string;
    CIDADE: string;
    UF: string;

}

export interface iParamToInsertFornecedor {
    nomeFornecedor: string;
    cdBanco: string;
    cdAgencia: string;
    nrConta: string;
    cnpj: string;
}

export interface iParamGetFornecedor {
    offset: number;
    param: {
        nomeFornecedor?: string;
    };
}

export interface iFieldDuplicity {
    cnpj: string;
    value: string;
    field: string;
}

