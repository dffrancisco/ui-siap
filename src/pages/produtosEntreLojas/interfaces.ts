
export interface ParamsLojas {
    cnpj: string;
    mes: number;
    ano: number;
}

export interface ParamsProdutos extends ParamsLojas {
    cnpj: string;
}

export interface ParamsOrcamentos extends ParamsProdutos {
    codProduto: number;
}

export interface iLojas {
    ID_CLIENTE: number;
    NOME: string;
    CGC_CLIENTE: string;
    HOST: string;
}

export interface iVendaLoja {
    nome: string;
    cgc_cliente: string;
    vlr: number;
}

export interface iProduto {
    COD_PRODUTO: number;
    DESC_PRODUTO: string;
    QTD: number;
    NUM_FABRICANTE: string;
    VALOR: number;
}

export interface iOrcamento {
    num_orcamento: number;
    data: Date;
    qto: number;
}


export interface iCount {
    TOTAL: number;
}


export interface iResponseLojas {
    data: iLojas[];

}

export interface iResponseProdutos {
    data: iProduto[];
    total: iCount[];
}

export interface iResponseOrcamentos {
    data: iOrcamento[];
    total: iCount[];
}

export interface iResponseRelatorio {
    dadosRelatorio: iDadosLojas[];
}
export interface iDadosLojas {
    NOME: string;
    CGC_CLIENTE: string;
    VLR: number;
}