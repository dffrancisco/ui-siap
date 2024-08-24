export interface iFuncionario {
    COD_FUNCIONARIO: number;
    CPF: string;
    CARGO: string;
    LOGIN: string;
    NOME_COMP: string;
}

export interface iMarcas {
    ID_MARCA: number;
    DESCRICAO: string;
    GRUPO: string;
    ID_MARCA_GRUPO: number;
    iProdutosEscolhidos
}

export interface iCarros {
    DESCRICAO: string;
    ID_CARRO: number;
}

export interface iFiltros {
    CONFERENTE: string;
    CRIADOR: string;
    DT_FILTRO: string;
    ID_FILTRO: number;
}