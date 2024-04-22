export interface iMesEAno {
    mes: number;
    ano: number;
}

export interface iMetaInserida {
    cargo: number;
    cod_funcionario: number;
    valorMeta: number;
    mes: number;
    ano: number;
}

export interface iMeta {
    LOGIN: any;
    CPF: string;
    COD_FUNCIONARIO: number;
    CARGO: string;
    VALOR_LIQUIDO: number;
    QTD_VENDAS: number;
    MES: number;
    ANO: number;
    VALOR_META: number;
    ATINGIDO: number;
    PREVISAO: number;
    MEDIA_DIARIA: number;
    PROGRESSO: number;
    META_DIARIA: number;
    VALOR_DIA: number;
}

export interface iFuncionario {
    LOGIN: any;
    CPF: string;
    COD_FUNCIONARIO: number;
    CARGO: string;
}

export interface iMetaVendedor extends iMeta { }

export interface iMetaMontador extends iMeta { }