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

export interface iTransportadora {
    ID_TRANSPORTADORA: number,
    RAZAO_SOCIAL: string,
    TELEFONE1: string,
    TELEFONE2: string,
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

export interface iResponseGetProdutosAdicionadosFunction {
    [id: string]: iProdutoAdicionado
}

export interface iTransportadora {
    ID_TRANSPORTADORA: number,
    RAZAO_SOCIAL: string,
    TELEFONE1: string,
    TELEFONE2: string,
}

export interface iDadosImpressao {
    NOME_MARCA: string,
    OBSERVACAO?: string,
    NUM_PEDIDO: number,
}