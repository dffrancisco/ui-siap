export interface iFornecedores {
    idFornecedor: number;
    cdBanco: string;
    cdAgencia: string;
    nrConta: string;
    nomeFornecedor: string;
    cnpj: string;
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

export interface iGetFornecedoresParam {

}
