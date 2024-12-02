export interface iFornecedores {
    idFornecedor: number;
    cdBanco: string;
    cdAgencia: string;
    nrConta: string;
    nomeFornecedor: string;
    cnpj: string;
    ie: string;
    razaoSocial: string;
    nomeFantasia: string;
    telefone: string;
    email: string;
    cep: string;
    endereco: string;
    bairro: string;
    cidade: string;
    uf: string;
}


export interface iParamGetFornecedor {
    offset: number;
    param: {
        razaoSocial?: string;
        deletado?: boolean;
    };
}

export interface iFieldDuplicity {
    value: string;
    field: string;
}

export interface iParamToInsert {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    ie: string;
    endereco: string;
    codCidade: string;
    bairro: string;
    telefone1: string;
    telefone2?: string;
    fax?: string;
    cep: string;
    homePage?: string;
    email: string;
    obs?: string;
}

export interface iParamToUpdate {
    idFornecedor: number;
    razaoSocial: string;
    nomeFantasia: string;
    ie: string;
    endereco: string;
    codCidade: string;
    bairro: string;
    telefone1: string;
    telefone2?: string;
    fax?: string;
    cep: string;
    homePage?: string;
    email: string;
    obs?: string;
}
