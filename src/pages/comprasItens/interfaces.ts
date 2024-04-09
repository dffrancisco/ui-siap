export interface iMarca {
    ID_MARCA: number,
    NOME_MARCA: string,
}

export interface iCabecalhoCompra {
    ID_COMPRAS: number,
    DATA: string,
    QTD_ITENS: number,
    VALOR: number,
    COMPRADOR: string,
    ID_MARCA_PRINCIPAL: number,
    MARCA_PRINCIPAL: string,
    MARCAS: iMarca[],
    OBS: string,
}

export interface iHistoricoMes {
    mes: string,
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

export type iTipoVisualizacao = 'unica' | 'lista';
export type iAbaHistorico = 'vendas' | 'compras';
export type iAbaItens = 'adicionados' | 'nao_adicionados'