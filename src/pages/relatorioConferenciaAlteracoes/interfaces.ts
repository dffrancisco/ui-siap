export interface iFuncionarios {
    CARGO: string;
    LOGIN: string;
    CPF: string;
    ID_CARGO: number;
    COD_FUNCIONARIO: number;
}

export interface iTelas {
    TELA: string;
}

export interface iParams {
    page: number;
    itemsPerPage: number;
    mes: number;
    ano: number | string;
    conteudo: string[];
    tela: string[];
    numFabricante: string;
    funcionario: number[]
}

export interface iResponseDadosInput {
    funcionarios: iFuncionarios[];
    telas: iTelas[];
}

export interface iDadosRelatorio {
    COD_FUNCIONARIO: number;
    CONTEUDO: string;
    DATA: string;
    DESC_PRODUTO: string;
    ID_LOG: number;
    LOGIN: string;
    MARCA: string;
    NUM_FABRICANTE: string;
}

export interface iCount {
    TOTAL: number;
}

export interface iResponseRelatorio {
    dadosRelatorio: iDadosRelatorio[];
    totalDadosRelatorio: iCount[];
}