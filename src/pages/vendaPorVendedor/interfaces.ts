export interface iParamGetVendas {
    DATA_INICIO: string;
    DATA_FIM: string;
}

export interface iVenda {
    LOGIN: string,
    COD_FUNCIONARIO?: number,
    VALOR_VENDA: number,
    VALOR_DEVOLUCAO: number,
    QTD_VENDAS: number,
    VENDA_LIQUIDA: number,
    TICKET_MEDIO: number,
    LIMITE: number,
    QTD_ITENS: number
}

export interface iVendaPorDiaGrafico {
    DIA: number;
    VALOR: number
}

export interface iVendaPorHoraGrafico {
    HORA: number;
    VALOR: number
}

export interface iGetVendasResponse extends iVenda { }

export interface iParamGetVendasDetalhes {
    DATA_INICIO: string;
    DATA_FIM: string;
    ID_VENDEDOR: number;
}

export interface iDevolucaoDetalhes {
    NUM_ORCAMENTO: number,
    VALOR: number,
    VALOR_MONTAGEM: number,
    VALOR_ORCAMENTO: number,
    DESCONTO: number,
    DATA: string,
    NOME: string,
    ID_DEVOLUCAO: number,
    DATA_VENDA: string,
}

export interface iVendaGraficoDetalhes {
    VALOR: number,
    DIA: number
}

export interface iVendaDetalhes {
    vendasDevolucoesDetalhes: iDevolucaoDetalhes[],
    vendasGraficoDetalhes: iVendaGraficoDetalhes[]
}

export interface iGetVendasDetalhesResponse extends iVendaDetalhes { }

export interface iParamGetVendasGraficos {
    DATA_INICIO: string;
    DATA_FIM: string;
}

export interface iGetVendasGraficosResponse {
    vendasPorDiaGrafico: iVendaPorDiaGrafico[],
    vendasPorHoraGrafico: iVendaPorHoraGrafico[]
}