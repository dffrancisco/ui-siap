export interface iVendasPorMarca {
    ID_MARCA: number,
    DESCRICAO: string,
    QTD: number,
    VALOR: number,
    TICKET_MEDIO: number,
    QTD_MEDIA_ITENS: number,
    PERCENTUAL?: number | string,
}

export interface iParamGetVendasPorMarca {
    param: {
        MES: number;
        ANO: number;
    }
}

export interface iGetVendasPorMarcaResponse extends iVendasPorMarca { }