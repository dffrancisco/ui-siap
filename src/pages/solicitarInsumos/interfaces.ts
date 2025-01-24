export interface iCategoriaComItens {
    ID_INSUMO_CATEGORIA: number;
    CATEGORIA: string;
    itens: iItens[];
}
export interface iItens {
    ID_INSUMO_PEDIDO_ITEM: number | null;
    ID_INSUMO_PEDIDO: number;
    ID_INSUMO_ITEM: number;
    ID_INSUMO_CATEGORIA: number;
    DESCRICAO: string;
    QTD: number | null;
}
export interface iCarrinhoInsumos extends iItens { }

export interface iItemAdcPedido extends iItens { }

export interface iResponseIdItem {
    ID_INSUMO_PEDIDO_ITEM: number;
}
export interface iPedido {
    ID_INSUMO_PEDIDO: number;
    DATA_HORA_INICIO: string;
    DATA_HORA_FIM: string | null;
    FINALIZADO: string;
    COD_FUNCIONARIO_FINALIZOU: number | null;
    totalItens: number;
    itens: iItens[];
}

export interface iDadosIniciais {
    categorias: iCategoriaComItens[]
    pedidos: iPedido[];
}