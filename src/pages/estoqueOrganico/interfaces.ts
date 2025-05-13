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

export interface iParams {
    numFabricante: string;
    descricao: string;
    endEstoque: string;
    marcas: number[];
    carros: number[];
}