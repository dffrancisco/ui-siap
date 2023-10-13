
export interface iDescontoMarca {
  ID_MARCA: number;
  DESCONTO: number;
  MARCA: string;
}


export interface iOrcamento {
  NUM_ORCAMENTO: number;
  NOME: string;
  DATA: string;
  VALOR: number;
  DESCONTO: number;
  DESCONTO_VENDEDOR: number;
  DESCONTO_GERENTE: number;
  DESCONTO_MARCA: number;
  VALOR_MONTAGEN: number;
  ID_CLIENTE: number;
  NOME_VENDEDOR: string;
  EFETIVADO: string;
  CPF: string;
  CPF_MONTADOR: string;
  PLACA?: string;
  NOME_MONTADOR?: string;

}

export interface iItensOrcamento {
  COD_PRODUTO: number;
  NUM_FABRICANTE: string;
  DESC_PRODUTO: string;
  CUSTO: number;
  CARRO: string;
  QTO: number;
  QTD_ESTOQUE: number;
  VALOR_REAL: number;
  VALOR: number;
  SUB_TOTAL: number;
  DESCONTO: number;
  DESCONTO_VENDEDOR: number;
  DESCONTO_GERENTE: number;
  DESCONTO_MARCA: number;
  MARCA: string;
  VENDA: number;
  ST_ICMS_PERCENTE: number;
  IPI_PERCENTE: number;
  FRETE_PERCENTE: number;
  CURVA_ABC_G: string;
}