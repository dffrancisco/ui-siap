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
}

export interface iGetProdutosParam {
    marcasEscolhidas: number[];
}

export interface iProdutos {
    COD_PRODUTO: number;
    DESC_PRODUTO: string;
    NUM_FABRICANTE: string;
    ID_MARCA: number;
}

export interface iProdutosEscolhidos {
    descricaoSelecionados: string;
    produtosEscolhidos: number[];
}

export interface iParamParaRelatorio {
    cod_funcionarios: number[];
    produtos: number[][];
    data_inicial: string;
    data_final: string;
}

export interface iDadosParaRelatorio {
    MARCA: string;
    QTD: number;
    VALOR: number;
    VENDEDOR: string;
}