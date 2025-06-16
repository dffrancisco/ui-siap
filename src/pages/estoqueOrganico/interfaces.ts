export interface iCarros {
    DESCRICAO: string;
    ID_CARRO: number;
}

export interface iMarcas {
    DESCRICAO: string;
    ID_MARCA: number;
    ID_MARCA_GRUPO: number;
    GRUPO: string;
}

export interface iResponseMarcasCarros {
    carros: iCarros[];
    marcas: iMarcas[];
}

export interface iCount {
    TOTAL: number;
}

export interface iDadosEstoqueOrganico {
    CARRO: string;
    COD_PRODUTO: number;
    DESC_PRODUTO: string;
    END_ESTOQUE: string | null;
    NUM_FABRICANTE: string;
    QUANTIDADE: number;
}

export interface iResponseEstoqueOrganico {
    dadosEstoqueOrganico: iDadosEstoqueOrganico[];
    total: iCount[];
}

export interface iParams {
    page: number;
    itemsPerPage: number;
    numFabricante: string;
    descricao: string;
    endEstoque: string;
    marcas: number[];
    carros: number[];
}