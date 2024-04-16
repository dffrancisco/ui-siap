export interface iParamGetVendasPorVendedor {
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

export interface iGetVendasPorVendedorResponse {
    vendas: iVenda[],
    vendasPorDiaGrafico: iVendaPorDiaGrafico[],
    vendasPorHoraGrafico: iVendaPorHoraGrafico[],
}