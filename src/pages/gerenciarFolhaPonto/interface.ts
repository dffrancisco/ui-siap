export interface iFuncionario {
  COD_FUNCIONARIO: number;
  CPF: string;
  CARGO: string;
  LOGIN: string;
  NOME_COMP: string;
  QTD_PONTOS_INCOMPLETOS: number;
  QTD_PONTOS_NAO_BATIDOS: number;
  QTD_FALTAS_JUSTIFICADAS: number;
  QTD_A_JUSTIFICAR: number;
}

export interface iGetMesEAno {
  cod_funcionario: number;
  mes: number;
  ano: number;
}

export interface iTotalizador {
  QTD_A_JUSTIFICAR: number;
  QTD_FALTAS_JUSTIFICADAS: number;
  QTD_PONTOS_INCOMPLETOS: number;
  QTD_PONTOS_NAO_BATIDOS: number;
}

export interface iGetDadosParaImpressao {
  mes: number;
  ano: number;
}

export interface iDadosFuncionariosFolhaPonto {
  pontos: any;
  faltas: any;
  COD_FUNCIONARIO: number;
  NOME_COMP: string;
  LOGIN: string;
  CPF: string;
  DELETADO: string;
  ID_CARGO: number;
  BATE_PONTO: string;
  CARGO: string;
  DATA: string;
  HORA_CHEGADA: string;
  HORA_ALMOCO_INICIAL: string;
  HORA_ALMOCO_FINAL: string;
  HORA_SAIDA: string;
  JUSTIFICATIVA: string;
  STATUS: string;
  TIPO: number;
}
