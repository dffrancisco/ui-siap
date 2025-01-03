
export interface iRamal {
    ID_RAMAL: number;
    ID_SOCIEDADE: number;
    ID_SETOR: number;
    RAMAL: string;
    NOME: string;
    ID_EMPRESA: number;
}


export interface iParamToInsertRamal {
    ID_SOCIEDADE: number;
    ID_SETOR: number;
    RAMAL: string;
    NOME: string;
}


export interface iParamToUpdateRamal {
    ID_RAMAL: number;
    ID_SOCIEDADE: number;
    ID_SETOR: number;
    RAMAL: string;
    NOME: string;
}


export interface iParamToGetRamal {
    offset: number;
    param: {
        ID_RAMAL?: number;
        ID_SOCIEDADE?: number;
        ID_SETOR?: number;
        RAMAL?: string;
        NOME?: string;
    };
}

export interface iGetDuplicityResponseRamal {
    RAMAL?: string;
    ID_SOCIEDADE?: number;
    ID_SETOR?: number;
}


export interface iSetor {
    ID_SETOR: number;
    NOME: string;
    ID_EMPRESA: number;
}


export interface iParamToInsertSetor {
    NOME: string;
}


export interface iParamToUpdateSetor {
    ID_SETOR: number;
    NOME: string;
}


export interface iParamToGetSetor {
    offset: number;
    param: {
        ID_SETOR?: number;
        NOME?: string;
    };
}


export interface iToDeleteResponse {
    delete: string;
    ID_RAMAL?: number;
}
