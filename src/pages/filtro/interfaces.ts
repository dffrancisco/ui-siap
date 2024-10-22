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
    HR_TERMINO: string | Date;
    DATA_INICIO: string;
    HR_INICIO: string;
    ID_FILTRO: number;
    NOME_FILTRO: string;
    QTD_ITENS: number;
    TIPO: string | null;
    HR_REVISAO: string | Date;
    DT_REVISAO: string;
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
    CONFERIDO_ESTOQUISTA: string,
    COD_FUNCIONARIO: number
    ID_FILTRO: number,
    DT_FILTRO: string,
    HR_INICIO: string,
    HR_TERMINO: string,
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
    CONFERENTE: string,
    QTD_ITENS: number,
    QTO_OLD: number,
    QTO_NEW: number,
    FINALIZADOR: string,
    ID_FINALIZADOR: number,
    ID_REVISOR: number,
    HR_REVISAO: string,
    DT_REVISAO: string,
    REVISOR: string,
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

export interface iDeleteItem {
    idFiltro: number;
    idItem: number;
}

export interface iItensConferidos {
    ID_ITENS_FILTRO: number;
    COD_PRODUTO: number;
    QTD_ESTOQUE: number;
}

export interface iFinalizarFiltro {
    idFiltro: number;
    qtdItensConferidos: number;
    itensConferidos: iItensConferidos[]
}

export interface iDadosFiltroRevisao {
    COD_FUNCIONARIO_CONFERENTE: number
    CONFERENTE: string
    CRIADOR: string
    DT_FILTRO: string
    DT_REVISAO: string | null
    DT_TERMINO: string | null
    FINALIZADOR: string | null
    HR_INICIO: string
    HR_REVISAO: string | null
    HR_TERMINO: string | null
    ID_CRIADOR: number
    ID_FILTRO: number
    ID_FINALIZADOR: number | null
    ID_REVISOR: number | null
    NOME_FILTRO: string
    QTD_ITENS: number
    QTD_ITENS_CONFERIDOS: number | null
    REVISOR: string | null
}

export interface iItensFiltroRevisao {
    COD_PRODUTO: number
    CONFERIDO: string
    CONFERENTE: string
    CONFERIDO_ESTOQUISTA: string
    DESC_PRODUTO: string
    END_ESTOQUE: string | null
    END_EXCESSO: string | null
    ID_ITENS_FILTRO: number
    NUM_FABRICANTE: string
    NUM_FABRICANTE2: string | null
    QTD_ESTOQUE: number
    QTO_NEW: number | null
    QTO_OLD: number
    HR_REVISAO: string | null
}

export interface iFiltroRevisao {
    dadosFiltro: iDadosFiltroRevisao;
    itensFiltro: iItensFiltroRevisao[]
}