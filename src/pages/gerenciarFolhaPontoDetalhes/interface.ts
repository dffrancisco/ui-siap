export interface iPonto {
  TIPO: number;
  STATUS: string;
  COD_FUNCIONARIO: number;
  DATA: Date;
  HORA_CHEGADA: string;
  HORA_ALMOCO_INICIAL: string;
  HORA_ALMOCO_FINAL: string;
  HORA_SAIDA: string;
  JUSTIFICATIVA: string;
}

export interface iTipoFaltasCount {
  DESCRICAO: string;
  EXIGE_CID: string;
  ID_TIPO_FALTA: number;
  IMPRIMIR_JUSTIFICATIVA: string;
  LANCAR_FALTA: string;
  TIPO: number;
  UPLOAD_ARQUIVO: string;
  COUNT: number;
}

export interface iGetDetalhes {
  cod_funcionario: number;
  mes: number;
  ano: number;
}

export interface iFaltaFeriadoFolga {
  falta: string;
  data: string;
  cod_funcionario: number;
  tipo: number;
}

export interface iDeletarDocumento {
  cod_funcionario: number;
  data: string;
  file_name: string;
  cnpj: string;
}

export interface iDeletarFalta {
  cod_funcionario: number;
  data: string;
  cnpj: string;
}

export interface iRegistrarDocumentoAusencia {
  nomeDoDocumento: string;
  cpf: string;
  docPasta: string;
  dataPonto: string;
  dataUpload: string;
  usuario: string;
  cnpj: string;
}

export interface iPropsPontosDiaSelecionado {
  COD_FUNCIONARIO: number;
  DATA: string;
  HORA_CHEGADA: string;
  HORA_ALMOCO_INICIAL: string;
  HORA_ALMOCO_FINAL: string;
  HORA_SAIDA: string;
  nome: string;
  cpf: string;
  cargo: string;
}

export interface iPropsFuncionario {
  cod_funcionario: number;
  nome: string;
  cpf: string;
  cargo: string;
  loginFuncionario: string;
}

export interface iPropsTiposDeFalta {
  DESCRICAO: string;
  EXIGE_CID: string;
  ID_TIPO_FALTA: number;
  IMPRIMIR_JUSTIFICATIVA: string;
  LANCAR_FALTA: string;
  TIPO: number;
  UPLOAD_ARQUIVO: string;
  COUNT: number;
}

export interface iRegistrarFalta {
  cod_funcionario: number;
  falta: string;
  justificativa: string;
  cid: string;
  tipoFalta: number;
  dataDocArquivo: string;
  id_documento: number;
}

export interface iParamDocumentoAusencia {
  data: string;
  cpf: string;
}

export interface iDadosDocumento {
  id_doc_funcionario: number;
  nome_arquivo: string;
  cpf: string;
  doc_pasta: string;
  data_ponto: string;
  data_upload: string;
  user_upload: string;
  cnpj: string;
}

export interface iDeletarArquivo {
  file_name: string;
  folderName: string;
  cpf: string;
  usuario: string;
}

export interface iGetDadosParaImpressaoIndividual {
  cod_funcionario: number;
  mes: number;
  ano: number;
}

export interface iDadosFuncionario {
  COD_FUNCIONARIO: number;
  CPF: string;
  NOME_COMP: string;
  LOGIN: string;
  DATA_ADMISSAO: string;
  CARGO: string;
}

export interface iPontos {
  COD_FUNCIONARIO: number;
  DATA: string;
  HORA_CHEGADA?: string;
  HORA_ALMOCO_INICIAL?: string;
  HORA_ALMOCO_FINAL?: string;
  HORA_SAIDA?: string;
  JUSTIFICATIVA?: string;
}

export interface iResumoPontos extends iDadosFuncionario {
  DELETADO: string;
  ID_CARGO: number;
  BATE_PONTO: string;
  QTD_PONTOS_BATIDOS: number;
  QTD_PONTOS_INCOMPLETOS: number;
  QTD_PONTOS_NAO_BATIDOS: number;
  QTD_FALTAS_JUSTIFICADAS: number;
  QTD_A_JUSTIFICAR: number;
}

export interface iTipoFaltas {
  ID_TIPO_FALTA: number;
  DESCRICAO: string;
  EXIGE_CID: string;
  IMPRIMIR_JUSTIFICATIVA: string;
  LANCAR_FALTA: string;
  TIPO: number;
  UPLOAD_ARQUIVO: string;
}

export interface iTotalizadorDeFaltas {
  TIPO: number;
  DESCRICAO: string;
  COUNT: number;
}

export interface iGetDetalhesResponse {
  dadosFuncionario: iDadosFuncionario;
  pontos: iPontos;
  resumoPontos: iResumoPontos;
  tipoFaltas: iTipoFaltas[];
  totalizadorDeFaltas: iTotalizadorDeFaltas[];
}

export interface iSetFeriadoFolgaResponse {
  ok: string;
}

export interface iSetFaltaResponse {
  ok: string;
}

export interface iDeleteFaltaResponse {
  ok: string;
}

export interface iDeleteDocumentoResponse {
  ok: string;
}

export interface iDeleteArquivoResponse {
  msg: string;
  error: string;
}

export interface iInserirRegistroAusenciaResponse {
  ok: string;
}

export interface iGetDadosParaImpressaoPDFResponse {
  dadosFuncionario: iDadosFuncionario;
  pontos: iPontos;
  resumoPontos: iResumoPontos;
  tipoFaltas: iTipoFaltas[];
  totalizadorDeFaltas: iTotalizadorDeFaltas[];
}
