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
}

export interface iResponseMetaInserida {
    cargo: string;
    cod_funcionario: number;
    valorMeta: number;
    mes: number;
    ano: number;
}

export interface iResponseMetasVendedoresEMontadores {
    LOGIN: string;
    CPF: string;
    COD_FUNCIONARIO: number;
    CARGO: string;
    VALOR_TOTAL: number;
    QTD_VENDAS: number;
    MES: number;
    ANO: number;
    VALOR_META: number;
    ATINGIDO: number;
    PREVISAO: number;
    MEDIA_DIARIA: number;
    PROGRESSO: number;
}
