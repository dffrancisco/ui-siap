
export interface iParamsRelatorioConhecimento {
    idTransportadora: number;
    dataInicio: string;
    dataFim: string;
    ordenacao: string;
}

export interface iTransportadora {
    ID_TRANSPORTADORA: number;
    RAZAO_SOCIAL: string;
}

export interface iRelatorioConhecimento {
    numNota: number;
    NUM_CONHECIMENTO: string;
    DATA_CONHECIMENTO: string;
    TOTAL_FATURA: number;
    PERCENTUAL: string;
    PAGAMENTO: number;
    NOME_FANTASIA: string;
}
