
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
    numConhecimento: string;
    dataConhecimento: string;
    totalFatura: number;
    percentual: string;
    pagamento: number;
    nomeFantasia: string;
}
