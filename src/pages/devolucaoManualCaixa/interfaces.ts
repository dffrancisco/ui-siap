export interface iDadosDoCaixa {
  COD_FUNCIONARIO: number;
  DATA_ABERTURA: string;
  HORA_ABERTURA: string;
  ID_ABERTURA_CAIXA: number;
  USUARIO: string;
}

export interface iDadosDaDevolucao {
  BLOQUEADO: string;
  DATA: string;
  DATA_VENDA: string;
  DESCRICAO_PAGAMENTO: string;
  ID_DEVOLUCAO: number;
  NUM_ORCAMENTO: number;
  VALOR: number;
}
