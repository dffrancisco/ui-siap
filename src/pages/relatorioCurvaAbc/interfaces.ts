
export interface iParams {
    page: number;
    itemsPerPage: number;
    dataInicio?: string;
    dataFim?: string;
    curva: string[];
    marca?: number[]
    filtro: string;
    numFabricante?: string;
    funcionario?: number[];
}


export interface iDadosRelatorio {
    NUM_FABRICANTE: string;
    DESC_PRODUTO: string;
    DESCRICAO: string;
    MARCA: string;
    ENDERECO: string;
    QUANTIDADE: number;
    VENDAS: number;
    CURVA_ABC_G: string;
    CURVA_ABC_M: string;
}

export interface iMarcas {
    ID_MARCA: number;
    MARCA: string;
}

export interface iCount {
    TOTAL: number;
}

export interface iResponseRelatorio {
    dadosRelatorio: iDadosRelatorio[];
    totalDadosRelatorio: iCount[];
}
