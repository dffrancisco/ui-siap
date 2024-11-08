
export interface iParams {
    page: number;
    itemsPerPage: number;
    dataInicio?: string;
    dataFim?: string;
    curva: string[];
    marca: { value: string; label: string }[] | undefined;
    filtro: string;
    numFabricante?: string;
    funcionario?: number[];
}

export interface iResponseDadosInput {
    curvas: string[];
    marcas: string[];
}

export interface iResponseMarca {
    curvas: string[];
}

export interface iDadosRelatorio {
    NUM_FABRICANTE: string;
    ULTIMA_ENTRADA: string;
    DESCRICAO: string;
    MARCA: string;
    ENDERECO: string;
    QUANTIDADE: number;
    VENDAS: number;
    ABC_GERAL: string;
    ABC_MARCA: string;
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
