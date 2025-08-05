export interface iParamOrcamentosLoja {
    id_sociedade: number,
    cnpj: string,
    dataOrcamento: string
}


export interface iOrcamentoLoja {
    idSociedade: number;
    orcamentosObj: iOrcamentosObj;
}

export interface iOrcamentosObj {
    [NUM_ORCAMENTO: number]: iOrcamento;
}

export interface iOrcamento {
    dadosOrcamento: iDadosOrcamento;
    itens: iItemOrcamento[];
}

export interface iDadosOrcamento {
    NUM_ORCAMENTO: number;
    DATA: string;
    STATUS: string;
    DATA_CONFERENCIA: string | null;
    NOME_CLIENTE: string;
    LOGIN: string;
    CGC_CLIENTE: string;
    VALOR: number;
    HORA: string;
}

export interface iItemOrcamento {
    COD_PRODUTO: number;
    NUM_FABRICANTE: string;
    DESC_PRODUTO: string;
    CARRO: string;
    MARCA: string;
    QTO: number;
    NUM_ORCAMENTO: number;
    DATA: string;
    QUANTIDADE: number;
    QUANTIDADE_ESTOQUE: number;
    END_ESTOQUE: string;
    END_EXCESSO: string;
}