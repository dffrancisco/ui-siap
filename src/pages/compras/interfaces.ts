export interface iCompra {
    ID_COMPRAS: number,
    COMPRADOR: string,
    DATA: string,
    ID_MARCA: number,
    NOME_MARCA: string,
    OBS: string | null,
    TIPO_PAGAMENTO: string | null,
    VALOR: number,
    QTD_PARCELAS: number | null,
    PERCENTUAL_DESCONTO: number | null,
    DIAS_PARA_PAGAR: number | null,
    DIAS_PARA_FATURAR: number | null,
    ADD_DESCONTO_NO_CUSTO: 'S' | 'N',
    DATA_PAGAMENTO: string | null,
}

export interface iResponseInsertCompra {
    ID_COMPRAS: number,
    ID_MARCA: number,
}

export interface iParamInsertCompra {
    ID_MARCA: number,
    OBS: string,
    TIPO_PAGAMENTO: string | null,
    QTD_PARCELAS: number | null,
    PERCENTUAL_DESCONTO: number | null,
    DIAS_PARA_PAGAR: number | null,
    DIAS_PARA_FATURAR: number | null,
    ADD_DESCONTO_NO_CUSTO: 'S' | 'N',
}

export interface iParamUpdateCompra {
    ID_COMPRAS: number,
    OBS: string,
    TIPO_PAGAMENTO: string | null,
    QTD_PARCELAS: number | null,
    PERCENTUAL_DESCONTO: number | null,
    DIAS_PARA_PAGAR: number | null,
    DIAS_PARA_FATURAR: number | null,
    ADD_DESCONTO_NO_CUSTO: 'S' | 'N',
}

export interface iParamDeleteCompra {
    ID_COMPRAS: number,
}

export interface iMarca {
    ID_MARCA: number,
    DESCRICAO: string,
}

export interface marcaAgrupada {
    qtd: number,
    nomeMarca: string,
    valor: number,
    selecionada: boolean,
}

export interface objMarcasAgrupadas {
    [nomeMarca: string]: marcaAgrupada
}