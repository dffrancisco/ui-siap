export interface iDadosRelatorioEntregarReceber {
    // COD_PRODUTO: number;
    // DESC_PRODUTO: string;
    // END_ESTOQUE: string;
    // NUM_FABRICANTE: string;
    // QTO_ESTOQUE: number;
    // QTO_VENDA: number;
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