
export interface ParamsLojas {
    mes: number;
    ano: number;
}

export interface ParamsProdutos extends ParamsLojas {
    cnpj: string;
}

export interface ParamsOrcamentos extends ParamsProdutos {
    codProduto: number;
}

export interface iLoja {
    nome: string;
    cgc_cliente: string;
    host: string;
}

export interface iVendaLoja {
    nome: string;
    cgc_cliente: string;
    vlr: number;
}

export interface iProduto {
    cod_produto: number;
    desc_produto: string;
    qtd: number;
    num_fabricante: string;
    valor: number;
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
    data: iLoja[];
    total: iCount[];
}

export interface iResponseVendaLoja {
    data: iVendaLoja[];
    total: iCount[];
}

export interface iResponseProdutos {
    data: iProduto[];
    total: iCount[];
}

export interface iResponseOrcamentos {
    data: iOrcamento[];
    total: iCount[];
}