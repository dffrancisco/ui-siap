export interface iDadosRelatorioProdutosVendidos {

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

export interface iResponseDadosProdutosVendidos {
    dadosRelatorio: iDadosRelatorioProdutosVendidos[];
    totalDadosRelatorio: iCount[];
}