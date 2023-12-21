export interface iPagamento {
  TIPO_PAGAMENTO: string,
  DESCRICAO_PAGAMENTO: number,
  TOTAL: number,
}

export interface iTotalizador {
  QTD: number,
  VALOR: number,
  PAGAMENTOS: iPagamento[]
}

export interface iMotorista {
  COD_FUNCIONARIO: number;
  NOME_MOTORISTA: string;
  QTD: number;
  VALOR: number;
  CPF: string;
}

export interface iCliente {
  ID_CLIENTE: number;
  CLIENTE: string;
  QTD: number;
  VALOR: number;
}

export interface iEntregarReceber {
  NOME: string;
  LOGIN: string;
  NUM_ORCAMENTO: number;
  DATA: string;
  HORA: string;
  DESCONTO: number;
  VALOR: number;
  MES: number;
  DESCRICAO: string;
}