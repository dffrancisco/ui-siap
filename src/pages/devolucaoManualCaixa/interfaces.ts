export interface iDadosDoCaixa {
  COD_FUNCIONARIO: number;
  DATA_ABERTURA: string;
  HORA_ABERTURA: string;
  ID_ABERTURA_CAIXA: number;
  USUARIO: string;
}

export interface iDadosDaDevolucao {
  BLOQUEADO: string;
  ID_DEVOLUCAO: number;
  VALOR: number;
  DESCRICAO_PAGAMENTO: string;
  NUM_ORCAMENTO: number;
  DATA: string;
  DATA_VENDA: string;
}

export interface iCaixa{
  USUARIO: string
}
