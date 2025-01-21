
export interface iParamsRelatorioConhecimento {
    idTransportadora: number;
    dataInicio: string;
    dataFim: string;
    ordenacao: string;
}

export interface iTransportadora {
    idTransportadora: number;
    razaoSocial: string;
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
