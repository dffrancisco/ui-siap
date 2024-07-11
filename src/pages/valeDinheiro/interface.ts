export interface iValeAPagar {
  COD_FUNCIONARIO: number,
  NOME: string,
  CARGO: string,
  VALOR: number,
  FORMA_PAGAMENTO: 'D' | 'P',
  DATA: string,
  DATA_PG: string,
}

export interface iValePago {
  COD_FUNCIONARIO: number,
  NOME: string,
  PAGADOR: string,
  CARGO: string,
  VALOR: number,
  FORMA_PAGAMENTO: 'D' | 'P',
  DATA: string,
  DATA_PG: string,
}

export interface iValeAPagarAlteracao extends iValeAPagar {
  novoValor: string,
}

export interface iGetValesAPagarResponse extends Array<iValeAPagar> { }

export interface iGetValesPagosResponse extends Array<iValePago> { }

export interface iGetValorDisponivelValeResponse {
  valorDisponivelVale: number,
}

export interface iParamNegarValeRequest {
  COD_FUNCIONARIO: number,
  DATA: string,
}

export interface iParamAlterarValeRequest {
  COD_FUNCIONARIO: number,
  DATA: string,
  VALOR: number,
}

export interface iParamPagarValeRequest {
  funcionarios: {
    COD_FUNCIONARIO: number,
    DATA: string,
    FORMA_PAGAMENTO: 'P' | 'D'
  }[],
  COD_FUNCIONARIO_PAGADOR: number,
}

export interface iHistoricoMes {
  mesExtenso: string,
  mes: number,
  ano: number,
  qtd: number,
}