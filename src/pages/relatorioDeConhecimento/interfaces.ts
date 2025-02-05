
export interface iParamsRelatorioConhecimento {
    idTransportadora: number;
    dataInicio: string;
    dataFim: string;
    ordem: string[];
}

export interface iTransportadora {
    ID_TRANSPORTADORA: number;
    RAZAO_SOCIAL: string;
}

export interface iRelatorioConhecimento {
    NOME_FANTAZIA: string;
    NUM_NOTA: string;
    NUM_CONHECIMENTO: string;
    DATA_CONHECIMENTO: string;
    TOTAL_FATURA: number;
    PERCENTUAL: string;
    PAGAMENTO: number;
}

export interface iDadosParaRelatorio {
    dadosRelatorio: iRelatorioConhecimento[]
}
