export interface iVendaPorCategoria {
    VALOR: number;
    VENDEDOR: string;
    GRUPO: string;
}

export interface iGetVendasPorCategoriaResponse extends iVendaPorCategoria { }
export interface iParamGetVendasPorCategoria {
    DATA_INICIO: string;
    DATA_FIM: string;
    ID_MARCA_GRUPO: number
}

export interface iListaMarcasGrupos {
    ID_MARCA_GRUPO: number;
    DESCRICAO: string;
}

export interface iGetMarcasGruposResponse extends iListaMarcasGrupos { }

export interface iDataImpressao {
    dataInicio: string;
    dataFinal: string;
}