export interface iGetItens {
    search: string;
    categoria: number;
}

export interface iCategorias {
    ID_INSUMO_CATEGORIA: number;
    CATEGORIA: string;
}

export interface iItens {
    ID_INSUMO_ITEM: number;
    ID_INSUMO_CATEGORIA: number;
    DESCRICAO: string;
}