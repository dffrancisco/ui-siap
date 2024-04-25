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