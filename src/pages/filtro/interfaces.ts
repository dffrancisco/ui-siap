export interface iFuncionario {
    COD_FUNCIONARIO: number;
    CPF: string;
    CARGO: string;
    DELETADO: string;
    ID_CARGO: number;
    LOGIN: string;
    NOME_COMP: string;
}

export interface iMarcas {
    ID_MARCA: number;
    DESCRICAO: string;
    GRUPO: string;
    ID_MARCA_GRUPO: number;
}

export interface iCarros {
    DESCRICAO: string;
    ID_CARRO: number;
}

export interface iResponseDadosParaFiltros {
    funcionarios: iFuncionario[];
    marcas: iMarcas[];
    carros: iCarros[];
}

export interface iResponseFiltros {
    filtros: iFiltros[];
    totalFiltros: number;
}

export interface iFiltros {
    CONFERENTE: string;
    CRIADOR: string;
    DATA_FIM: string;
    DATA_INICIO: string;
    ID_FILTRO: number;
    NOME_FILTRO: string;
    QTD_ITENS: number;
    TIPO: string | null;
}

export interface iResultPesquisa {
    CARRO: string;
    COD_PRODUTO: number;
    DESC_PRODUTO: string;
    END_ESTOQUE: string;
    END_EXCESSO: string;
    MARCA: string;
    NUM_FABRICANTE: string;
    NUM_FABRICANTE2: string;
    QUANTIDADE: number;
}

export interface iParamFiltros {
    page: number;
    itensPerPage: number;
    search: string;
    status: undefined | string;
}

export interface iParamFiltrar {
    search: string;
    marca: number | null;
    carro: number | null;
    endEstoque: string;
    numFabricante: string;
    descricaoProduto: string;
};

export interface iDadosFiltro {
    QTD_ATUAL: number,
    DATA: string,
    CONFERIDO: string,
    COD_FUNCIONARIO: number
    ID_FILTRO: number,
    DT_FILTRO: string,
    HR_INICIO: string,
    ID_CRIADOR: number,
    ID_ITENS_FILTRO: number,
    ID_CONFERENTE: number,
    DT_TERMINO: string,
    COD_PRODUTO: number,
    NUM_FABRICANTE: string,
    NUM_FABRICANTE2: string,
    NOME_FILTRO: string,
    DESC_PRODUTO: string,
    END_ESTOQUE: string,
    END_EXCESSO: string,
    QTD_ESTOQUE: number,
    CRIADOR: string,
    CONFERENTE: string
}

export interface iInsertOuUpdate {
    idFiltro: number;
    nomeFiltro: string;
    funcionario: number;
    objPesquisa: [{
        search: string,
        marca: [],
        carro: [],
        endEstoque: string,
        numFabricante: string,
        descricaoProduto: string,

    }];
    produtosSelecionados: number[];
}

export interface iUpdateNomeFiltro {
    idFiltro: number;
    nomeFiltro: string;
    funcionario: number;
}