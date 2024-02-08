export interface iParam {
  cod_funcionario: number;
  mes: number;
  ano: number;
}

export interface iParamComCPF {
  cod_funcionario: number;
  cpf: string;
  mes: number;
  ano: number;
}

export interface iPonto {
  TIPO: number;
  STATUS: string;
  COD_FUNCIONARIO: number;
  DATA: Date;
  HORA_CHEGADA: string;
  HORA_ALMOCO_INICIAL: string;
  HORA_ALMOCO_FINAL: string;
  HORA_SAIDA: string;
}

export interface iTipoFaltasCount {
  DESCRICAO: string;
  EXIGE_CID: string;
  ID_TIPO_FALTA: number;
  IMPRIMIR_JUSTIFICATIVA: string;
  LANCAR_FALTA: string;
  TIPO: number;
  UPLOAD_ARQUIVO: string;
  COUNT_TIPO: number;
}

export interface iCodFunc {
  cod_funcionario: number;
}

export interface iFaltaFeriadoFolga {
  falta: string;
  data: string;
  cod_funcionario: number;
  tipo: string;
}

export interface iDeletarFalta {
  cod_funcionario: number;
  data: string;
}

export interface iRegistrarDocumentoAusencia {
  nomeDoDocumento: string;
}
