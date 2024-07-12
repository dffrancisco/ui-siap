export interface iVendaPorCategoria {
    VENDA: number;
    VENDEDOR: string;
    GRUPO: string;
}

export interface iGetVendasPorCategoriaResponse extends iVendaPorCategoria { }
export interface iParamGetVendasPorCategoria {
    DATA_INICIO: string;
    DATA_FIM: string;
}