export interface iDadosRelatorioEntregarReceber {
    COD_FUNCIONARIO: number;
    DATA: string;
    DATA_RECEBIMENTO: string;
    DESCRICAO_PAGAMENTO: string;
    HORA: string;
    LOGIN: string;
    NOME_CLIENTE: string;
    NUM_ORCAMENTO: number;
    TIPO_PAGAMENTO: string;
    VALOR_RECEBIDO: number;
}

export interface iParamsParaRelatorio {
    page: number;
    itemsPerPage: number;
    dataInicio: string;
    dataFim: string;
}

export interface iCount {
    TOTAL: number;
}

export interface iResponseDadosEntregarReceber {
    dadosRelatorio: iDadosRelatorioEntregarReceber[];
    totalDadosRelatorio: iCount[];
}