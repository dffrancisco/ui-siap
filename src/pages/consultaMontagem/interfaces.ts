export interface iMontagem {
    ID_MONTADOR?: number;
    LOGIN: string;
    VALOR: number;
    VALOR_DEVOLUCAO: number;
    TOTAL: number;
}

export interface iMontagemDetalhe {
    param: object;
    offset: number;
}

export interface iParamGetMontagens {
    dataInicio: string;
    dataFim: string;
}
export interface iMontagemDetalhes {
    montagemDetalhes: {
        VALOR: number,
        DATA: string,
        NUM_ORCAMENTO: number,
        PLACA: string,
        VENDEDOR: string
    },

    devolucaoDetalhes: {
        NUM_ORCAMENTO: number,
        PLACA: string,
        VALOR: number,
        DATA_VENDA: string,
        DATA: string
    },

    dadosToGraficoDia: [{
        VALOR: number,
        DATA: string,
        DIA: string
    }]
}

export interface iDadosToGraficoDia {
    VALOR: number,
    DATA: string,
    DIA: string
}

export interface iParamGetMontagemDetalhes {
    dataInicio: string;
    dataFim: string;
    ID_MONTADOR: number;
}

export interface iGetMontagensResponse extends iMontagem { }
export interface iGetMontagemDetalhesResponse extends iMontagemDetalhes { }