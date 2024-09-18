export interface iRequisicaoCompra {
    NOME_FAVORECIDO: string;
    DATA_HORA_CRIACAO: string;
    CNPJ_FAVORECIDO: string;
    FINALIZADO: 'S' | 'N';
    ID_REQUISICAO_COMPRA: number;
    VALOR: number;
    DATA_HORA_FINALIZADO?: string;
    COD_FUNCIONARIO_FINALIZOU?: number;
}

export interface iRequisicaoItem {
    ID_REQUISICAO_COMPRA_ITEM: number;
    ID_REQUISICAO_COMPRA: number;
    COD_PRODUTO: number;
    QTD: number;
    VALOR_UNITARIO: number;
    TOTAL: number;
    DESCRICAO: string
}

export interface iGetFavorecidosParam {
    search: string;
}

export interface iFavorecido {
    ID_FAVORECIDO: number,
    NOME_FAVORECIDO: string;
    CNPJ_FAVORECIDO: string
}

export interface iGetFavorecidosResponse extends iFavorecido { }