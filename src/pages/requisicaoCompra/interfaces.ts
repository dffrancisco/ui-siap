import { ex } from "@fullcalendar/core/internal-common";

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
    COD_PRODUTO?: number;
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
    ID_REQUISICAO_COMPRA: number,
    VALOR: number
}

export interface iFinalizarRequisicaoCompraResponse extends iSuccessResponse {
    loginFuncionario: string,
    codFuncionario: number
}

export interface iGetDadosToSelectProdutoResponse {
    marcas: iMarcas[],
    carros: iCarros[]
}

export interface iMarcas {
    ID_MARCA: number,
    DESCRICAO: string
}

export interface iCarros {
    ID_CARRO: number,
    DESCRICAO: string
}

export interface iGetProdutosParam {
    ID_MARCA?: number;
    ID_CARRO?: number;
    search: string;
}

export interface iProduto {
    COD_PRODUTO: number,
    DESC_PRODUTO: string,
    QUANTIDADE?: number,
    NUM_FABRICANTE?: string,
    FOTO?: 'S' | 'N',
    CARRO?: string
}

export interface iGetProdutosResponse extends iProduto {
}

export interface iInsertOrUpdateItemParam {
    ID_REQUISICAO_COMPRA?: number,
    COD_PRODUTO: number,
    QTD: number,
    VALOR_UNITARIO: number,
    TOTAL: number,
    DESCRICAO: string,
}

export interface iInsertOrUpdateItemResponse extends iSuccessResponse {
    idRequisicaoCompraItem: number
}

export interface iGetRequisicaoCompraItensParam {
    ID_REQUISICAO_COMPRA: number
}

export interface iGetRequisicaoCompraItensResponse extends iRequisicaoItem { }

export interface iItemToEdit {
    ID_REQUISICAO_COMPRA_ITEM: number,
    COD_PRODUTO: number,
    QTD: number,
    VALOR_UNITARIO: number,
    TOTAL: number,
    DESCRICAO: string
}

export interface iDeleteRequisicaoComprasItemParam {
    ID_REQUISICAO_COMPRA_ITEM: number
}

export interface iDeleteRequisicaoComprasItemResponse extends iSuccessResponse { }

export interface iItemNovo {
    QTD: number,
    VALOR_UNITARIO: string,
    DESCRICAO: string
}

export interface iItemNovoToEdit extends iItemNovo {
    ID_REQUISICAO_COMPRA_ITEM: number
}

export interface iInsertItemNovoParam {
    ID_REQUISICAO_COMPRA?: number,
    DESCRICAO: string
    QTD: number,
    VALOR_UNITARIO: number,
    TOTAL: number,
}

export interface iUpdateItemNovoParam {
    ID_REQUISICAO_COMPRA_ITEM: number,
    DESCRICAO: string,
    QTD: number,
    VALOR_UNITARIO: number,
    TOTAL: number,
}