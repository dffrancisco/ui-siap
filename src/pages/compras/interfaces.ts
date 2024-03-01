export interface iCompra {
    ID_COMPRAS: number,
    COMPRADOR: string,
    DATA: string,
    ID_MARCA: number,
    NOME_MARCA: string,
    OBS: string | null,
    TIPO_PAGAMENTO: string | null,
    VALOR: number
}

export interface marcaAgrupada {
    qtd: number,
    nomeMarca: string,
    valor: number,
}

export interface objMarcasAgrupadas {
    [nomeMarca: string]: marcaAgrupada
}