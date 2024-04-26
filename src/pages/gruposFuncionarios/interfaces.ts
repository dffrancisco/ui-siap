export interface iParamGetGruposImpressao {
    offset: number,
    param: {
        DESCRICAO?: string;
    }
}

export interface iGrupo {
    ID_GRUPO_IMPRESSAO: number,
    NOME: string,
    FUNCIONARIOS: [{
        ID_GRUPO_IMPRESSAO: number,
        COD_FUNCIONARIO: number
    }]
}

export interface iGetGruposImpressaoResponse extends iGrupo { }

export interface iParamGetDuplicityGrupoImpressao {
    value: string,
    field: string,
}

export interface iGetDuplicityGrupoImpressaoResponse {
    NOME: string
}

export interface iParamInsertGrupoImpressao extends iGetDuplicityGrupoImpressaoResponse { }

export interface iInsertGrupoImpressaoResponse {
    ID_GRUPO_IMPRESSAO: number
}

export interface iParamUpdateGrupoImpressao {
    ID_GRUPO_IMPRESSAO: number,
    NOME: string
}

export interface iUpdateGrupoImpressaoResponse {
    ID_GRUPO_IMPRESSAO: number
}

export interface iParamDeleteGrupoImpressao extends iUpdateGrupoImpressaoResponse { }

export interface iDeleteGrupoImpressaoResponse {
    msg: string
}

export interface iListaFuncionario {
    CPF: string,
    COD_FUNCIONARIO: number,
    LOGIN: string
}

export interface iGetFuncionariosResponse extends iListaFuncionario { }

export interface iFuncionarioGrupo {
    COD_FUNCIONARIO?: number,
    ID_GRUPO_IMPRESSAO?: number
}

export interface iParamInsertGrupoImpressaoFuncionario extends iFuncionarioGrupo { }

export interface iInsertGrupoImpressaoFuncionarioResponse {
    COD_FUNCIONARIO: number,
}

export interface iParamDeleteGrupoImpressaoFuncionario {
    COD_FUNCIONARIO: number,
    ID_GRUPO_IMPRESSAO: number
}

export interface iDeleteGrupoImpressaoFuncionarioResponse {
    msg: string
}