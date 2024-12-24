export interface iParamsUsoConsumo {
    dataInicio: string;
    dataFim: string;
}

export interface iDadosUsoConsumo {
    ID_CONSUMO: number;
    DATA: string;
    NUM_NOTA: number;
    DESCRICAO: string;
    CHAVE: string;
    VALOR: number;
}

export interface iResponseUsoConsumo {
    dadosRelatorio: iDadosUsoConsumo[];
}
