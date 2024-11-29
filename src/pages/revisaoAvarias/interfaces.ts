import { Moment } from "moment"

export interface iGetDadosToSelectsResponse {
    avariasDestinos: iAvariaDestino[]
    funcionarios: iFuncionario[]
}

export interface iAvariaDestino {
    ID_AVARIA_DESTINO: number,
    DESCRICAO: string
}

export interface iFiltro {
    NUM_FABRICANTE_PRODUTO: string,
    REVISADA: number,
    DESTINO: number
}

export interface iAvaria {
    ID_AVARIA: number,
    NUM_FABRICANTE: string,
    DESC_PRODUTO: string,
    NOME_FUNCIONARIO_IDENTIFICOU: string,
    COD_FUNCIONARIO_IDENTIFICOU: number
    FINALIZADO: 'S' | 'N',
    DESTINO?: string,
    ORIGEM_AVARIA: 'D' | 'F' | 'L',
    ID_AVARIA_DESTINO?: number,
    DESCRICAO_AVARIA: string,
    NOME_FUNCIONARIO_VALIDOU?: string,
    DATA_HORA_VALIDACAO?: string | Moment,
}

export interface iGetAvariasResponse extends iAvaria { }

export interface iFuncionario {
    COD_FUNCIONARIO: number,
    LOGIN: string,
}

export interface iGetImgsResponse {
    imgs: string[],
    cnpjEmpresa: string
}

export interface iFinalizarAvariaParam {
    COD_FUNCIONARIO_IDENTIFICOU: number,
    ORIGEM_AVARIA: 'D' | 'F' | 'L',
    DESCRICAO: string,
    ID_AVARIA_DESTINO: number,
    ID_AVARIA: number,
}

export interface iSuccessResponse {
    msg: string,
    success: boolean
}

export interface iFinalizarAvariaResponse extends iSuccessResponse {
    login: string,
    dataHora: Moment
}

export interface iDadosPreencherAvaria {
    ID_AVARIA: number,
    COD_FUNCIONARIO_IDENTIFICOU: number,
    ID_AVARIA_DESTINO: number,
    DATA_HORA_VALIDACAO: Moment,
    NOME_FUNCIONARIO_VALIDOU: string,
    ORIGEM_AVARIA: 'D' | 'F' | 'L',
    DESCRICAO_AVARIA: string
}

export interface iDeletarAvariaResponse extends iSuccessResponse { }