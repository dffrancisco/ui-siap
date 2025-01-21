export interface iGetItens {
    search: string;
    categoria: number;
}
export interface iCategorias {
    ID_INSUMO_CATEGORIA: number;
    CATEGORIA: string;
}
export interface iItens {
    ID_INSUMO_PEDIDO_ITEM: number | null;
    ID_INSUMO_PEDIDO: number;
    ID_INSUMO_ITEM: number;
    ID_INSUMO_CATEGORIA: number;
    DESCRICAO: string;
    QTD: number | null;
}
export interface iCarrinhoInsumos {
    ID_INSUMO_PEDIDO: number;
    ID_INSUMO_ITEM: number;
    ID_INSUMO_CATEGORIA: number;
    ID_INSUMO_PEDIDO_ITEM: number | null;
    DESCRICAO: string;
    QTD: number;
}

export interface iItemAdcPedido extends iCarrinhoInsumos { }

export interface iPedidosInsumos {
    ID_INSUMO_PEDIDO: number;
    DATA_HORA_INICIO: string;
    DATA_HORA_FIM: string | null;
    FINALIZADO: string;
    COD_FUNCIONARIO_FINALIZOU: number | null;
    totalItens: number;
    itens: iItens[];
}