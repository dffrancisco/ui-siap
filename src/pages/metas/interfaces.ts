export interface iMesEAno {
    mes: number;
    ano: number;
}

export interface iResponseFuncionarios {
    CARGO: string;
    COD_FUNCIONARIO: number;
    CPF: string;
    DELETADO: string;
    ID_CARGO: number;
    LOGIN: string;
    NOME_COMP: string;
    VALOR_META: number
}

export interface iResponseMetaInserida {
    cargo: number;
    cod_funcionario: number;
    valorMeta: number;
    mes: number;
    ano: number;
}

export interface iResponseMetasVendedoresEMontadores {
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
