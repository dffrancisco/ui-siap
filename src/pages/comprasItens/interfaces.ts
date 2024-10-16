export interface iMarca {
    ID_MARCA: number,
    NOME_MARCA: string,
}

export interface iCabecalhoCompra {
    ID_COMPRAS: number,
    DATA: string,
    VALOR: number,
    COMPRADOR: string,
    ID_MARCA: number,
    NOME_MARCA: string,
    OBS: string,
}

export interface iHistoricoMes {
    mesExtenso: string,
    mes: number,
    ano: number,
    qtd: number,
}

export interface iUltimaVenda {
    NUM_ORCAMENTO: number,
    DATA: string,
    VENDEDOR: string,
    QTD: number,
    VALOR: number,
    CLIENTE: string,
    MESMO_GRUPO: 0 | 1,
}

export interface iUltimaCompra {
    NUM_NOTA: number,
    DATA: string,
    CUSTO: number,
    VENDA: number,
    QTD: number,
    FORNECEDOR: string,
    MESMO_GRUPO: 0 | 1,
}

export interface iCarro {
    ID_CARRO: number,
    NOME_CARRO: string,
}
export interface iParamGetDadosIniciais {
    ID_COMPRAS: number
}

export interface iTransportadora {
    ID_TRANSPORTADORA: number,
    RAZAO_SOCIAL: string,
    TELEFONE1: string,
    TELEFONE2: string,
}

export interface iResponseGetDadosIniciais {
    cabecalho: iCabecalhoCompra,
    carros: iCarro[],
    marcas: iMarca[],
    transportadoras: iTransportadora[],
}

export interface iParamGetProdutosFunction {
    ID_MARCA: number,
    ID_CARRO?: number,
    DESC_PRODUTO?: string,
    NUM_FABRICANTE?: string,
}

export interface iParamEmitBuscarProdutos {
    ID_MARCA: number,
    ID_CARRO?: number,
    DESC_PRODUTO?: string,
    NUM_FABRICANTE?: string,
    VER_TODOS_OS_ITENS?: boolean
}

export interface iParamInsertItemCompra {
    ID_COMPRAS: number,
    COD_PRODUTO: number,
    CUSTO: number,
    QUANTIDADE: number,
}

export interface iItemFila {
    ID_COMPRAS: number,
    COD_PRODUTO: number,
    CUSTO: number,
    QUANTIDADE: number,
    ACAO: 'ADD' | 'REM'
    TENTATIVAS: number,
    DESC_PRODUTO: string,
    NUM_FABRICANTE: string,
}

export interface iItemComErro {
    COD_PRODUTO: number,
    ACAO: 'ADD' | 'REM'
    ERRO_MSG: string,
    NUM_FABRICANTE: string,
    DESC_PRODUTO: string,
    TENTATIVAS: number,
}

export interface iParamDeleteItemCompra {
    ID_COMPRAS: number,
    COD_PRODUTO: number,
}

export interface iResponseInsertItemCompra {
    valorTotalPedido: number
}

export interface iResponseDeleteItemCompra {
    valorTotalPedido: number
}

export interface iColumnMappingProdutos {
    [apelido: string]: string,
}

export interface iProduto {
    A: number, // COD_PRODUTO
    B: string, // DESC_PRODUTO
    D: string, // FOTO
    E: string, // NUM_FABRICANTE
    F: string, // NUM_FABRICANTE2
    G: number, // QUANTIDADE
    H: string, // UNIDADE
    I: number, // VENDA
    J: number, // CUSTO
    L: string, // DESCRICAO_CARRO
    M: string, // DESCRICAO_MARCA
    N: string, // NOVO_PRODUTO
    CG: string, // CURVA_ABC_G
    CM: string, // CURVA_ABC_M
}
export interface iProdutoObj {
    [id: string]: iProduto
}

export interface iProdutoAdicionado extends iProduto {
    COD_PRODUTO: number,
    PEDIDO_QTD_ADICIONADA: number,
    PEDIDO_CUSTO_ADICIONADO: number,
}
export interface iProdutoAdicionadoObj {
    [id: string]: iProdutoAdicionado
}

export interface iResponseGetProdutosFunction {
    produtos: iProdutoObj,
    qtdItensMarca: number,
}
export interface iResponseGetProdutosAdicionadosFunction {
    [id: string]: iProdutoAdicionado
}

export interface iProdutoAdicionadoGrid extends iProduto {
    COD_PRODUTO: number,
    PEDIDO_QTD_ADICIONADA: number,
    PEDIDO_CUSTO_ADICIONADO: number,
}

export interface iProdutoNaoAdicionadoGrid extends iProduto {
    COD_PRODUTO: number,
    PEDIDO_QTD_ADICIONADA: number,
    PEDIDO_CUSTO_ADICIONADO: number,
}

export interface iUltimaVenda {
    COD: number,
    ORC: number,
    CL: string,
    VDR: string,
    DT: string,
    QTD: number,
    VND: number,
    MG: number,
}

export interface iHistoricoVendaGeral {
    meses: {
        [keyMesAno: string]: {
            QTD: number,
            MES: number,
            ANO: number,
        }
    }
    ultimasVendas: iUltimaVenda[]
}

export interface iObjHistoricoVendaGeral {
    [codProduto: string]: iHistoricoVendaGeral
}

export interface iHistoricoCompraGeral {
    meses: {
        [keyMesAno: string]: {
            QTD: number,
            MES: number,
            ANO: number,
        }
    }
    ultimasCompras: iUltimaCompra[]
}

export interface iObjHistoricoCompraGeral {
    [codProduto: string]: iHistoricoCompraGeral
}

export interface iParamEmitAdicionarItem {
    custo: number,
    qtd: number,
    isAlteracao?: boolean
}

export interface iListaFotoProduto {
    foto: string,
    nome: string,
    loja: string,
    publicacao: string,
    w: number,
    h: number,
    cpf: string
}

export interface iGetListaFotoJsonResponse extends iListaFotoProduto { }

export type iTipoVisualizacao = 'unica' | 'lista'
export type iAbaHistorico = 'vendas' | 'compras'
export type iAbaItens = 'adicionados' | 'nao_adicionados'
