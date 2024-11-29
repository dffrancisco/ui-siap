export interface iGetDadosToSelectsResponse {
    avariasDestinos: iAvariaDestino[]
    funcionarios: iFuncionario[]
}

export interface iAvariaDestino {
    ID_TIPO_DESTINO: number,
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
    DESTINO?: number,
    ORIGEM_AVARIA: 'D' | 'F' | 'L',
    ID_AVARIA_DESTINO?: number,
    DESCRICAO_AVARIA: string,
    NOME_FUNCIONARIO_VALIDOU?: string,
    DATA_HORA_VALIDACAO: string,
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