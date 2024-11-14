export interface iBairros {
    DESCRICAO: string;
    ID_BAIRRO: number;
}

export interface iCidades {
    COD_CIDADE: number;
    DESCRICAO: string;
    COD_IBGE: string;
    UF: string;
}

export interface iUF {
    SIGLA: string;
    ESTADO: string;
    CODIGO: string;
    IBGE: string;
}
export interface iDadosInputs {
    bairros: iBairros[];
    cidades: iCidades[];
    ufs: iUF[];
}
export interface iClientes {
    APELIDO: string;
    BOLETO_EMAIL: number;
    CEP: string;
    CEP_COR: string;
    CGC_CLIENTE: string;
    COD_CIDADE: number;
    CIDADE: string;
    CONT_COMPRAS: string;
    CONT_FINANCEIRO: string;
    EMAIL: string;
    EMAIL_FOR_BOLETO: string;
    ENDERECO: string;
    ENDERECO_COR: string;
    FISICA: string;
    ID_BAIRRO: number;
    BAIRRO: string;
    ID_EMPRESA: number;
    ID_CLIENTE: number;
    TELEFONE1: string;
    TELEFONE2: string;
    TELEFONE3: string;
    INSC_ESTADUAL: string;
    OBS_VENDAS: string;
    NOME: string;
    OBS: string;
    MESMO_GRUPO: string;
    UF: string;
    ATIVIDADE_CNAE: iAtividadesCNAE[]
}

export interface iGetClientes {
    search: string;
}

export interface iAtividadesCNAE {
    ATIVIDADE: string;
    CNAE: string;
    DESC_ATIVIDADE: string;
    CNPJ: string;
    ID_ATIVIDADE_EMPRESA: number;
}