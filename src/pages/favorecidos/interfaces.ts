export interface iFavorecidos {
    ID_FAVORECIDO: number;
    CD_BANCO: string;
    CD_AGENCIA: string;
    NR_CONTA: string;
    CD_OPERACAO: string;
    NM_FAVORECIDO: string;
    TP_VINCULO: string;
    NR_CPF: string;
    NR_CNPJ: string;
    NM_MATRIZ: string;
    TX_OBS: string;
    ID_EMPRESA: number;
}

export interface iParamToInsert {
    ID_FAVORECIDO: number;
    CD_BANCO: string;
    CD_AGENCIA: string;
    NR_CONTA: string;
    CD_OPERACAO: string;
    NM_FAVORECIDO: string;
    TP_VINCULO: string;
    NR_CP?: string;
    NR_CNPJ?: string;
    NM_MATRIZ: string;
}

export interface iParamGetFavorecido {
    offset: number;
    param: {
        DS_BANCO?: string;
    };
}

export interface iInsertResponse {
    CD_BANCO: string;
    ID_FAVORECIDO?: number;
    NR_CONTA?: string;
}

export interface iGetDuplicityResponse {
    SG_BANCO?: string;
    DS_BANCO?: string;
    CD_BANCO?: string;
    NR_CNPJ?: string;
    NR_CPF?: string;
}

export interface iFieldDuplicity {
    value: string;
    field: string;
}

export interface iBanco {
    CD_BANCO: string;
    DS_BANCO: string;

}

export interface iFavorecidoResponse extends iBanco {
    ID_FAVORECIDO?: number;
    NR_CONTA?: string;
    ID_EMPRESA?: number;
    NM_FAVORECIDO: string;
    TP_VINCULO: string;
    NR_CPF?: string;
    NR_CNPJ?: string;
    NM_MATRIZ: string;
    TP_VINCULO_DESC?: string;
}

export interface iParamToUpdate {
    CD_BANCO: string;
    CD_AGENCIA: string;
    NR_CONTA: string;
    CD_OPERACAO: string;
    NM_FAVORECIDO: string;
    TP_VINCULO: string;
    NM_MATRIZ: string;
}

export interface iToDeleteResponse {
    delete: string;
    ID_FAVORECIDO?: number;
    NR_CONTA?: string;
}

export interface iBancoResponse extends iBanco { }
