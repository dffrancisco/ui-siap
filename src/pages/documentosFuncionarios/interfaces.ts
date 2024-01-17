export interface iDocumentosFuncionarios {
    id_tipo_pasta_docs_funcionarios: number,
    descricao: string,
    pasta: string,
    controle: number,
}

export interface iParamGetDocumentosFuncionarios {
    offset: number,
    param: any
}

export interface iFieldDuplicity {
    value: string,
    field: string
}

export interface iGetDuplicityResponse {
    descricao: string;
}

export interface iParamToInsert {
    param: any
}

export interface iParamToUpdate extends iDocumentosFuncionarios{}
export interface iDocumentosFuncionariosResponse extends iDocumentosFuncionarios {}