export interface iRequisicaoCompra {
    NOME_FAVORECIDO: string;
    DATA_HORA_CRIACAO: string;
    CNPJ_FAVORECIDO: string;
    FINALIZADO: 'S' | 'N';
    ID_REQUISICAO_COMPRA: number;
    VALOR: number;
    DATA_HORA_FINALIZADO?: string;
    COD_FUNCIONARIO_FINALIZOU?: number;
    LOGIN_FUNCIONARIO_FINALIZOU?: string
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

export interface iInsertRequisicaoCompraParam {
    ID_FAVORECIDO: number
}

export interface iInsertRequisicaoCompraResponse {
    ID_REQUISICAO_COMPRA: number
}

export interface iGetDuplicidadeRequisicaoCompraParam {
    ID_FAVORECIDO: number
}

export interface iGetDuplicidadeRequisicaoCompraResponse {
    ID_REQUISICAO_COMPRA: number
}

export interface iGetRequisicoesComprasParam {
    search: string
}

export interface iGetRequisicoesComprasResponse {
    NOME_FAVORECIDO: string;
    CNPJ_FAVORECIDO: string;
    FINALIZADO: 'S' | 'N';
    ID_REQUISICAO_COMPRA: number;
    VALOR: number;
    DATA_HORA_FINALIZADO?: string;
}

export interface iGetRequisicaoCompraParam {
    ID_REQUISICAO_COMPRA: number
}

export interface iGetRequisicaoCompraResponse extends iRequisicaoCompra { }

export interface iDeleteRequisicaoCompraParam {
    ID_REQUISICAO_COMPRA: number
}

export interface iSuccessResponse {
    success: boolean;
    msg: string
}

export interface iDeleteRequisicaoCompraResponse extends iSuccessResponse { }

export interface iFinalizarRequisicaoCompraParam {
    ID_REQUISICAO_COMPRA: number
}

export interface iFinalizarRequisicaoCompraResponse extends iSuccessResponse {
    loginFuncionario: string,
    codFuncionario: number
}