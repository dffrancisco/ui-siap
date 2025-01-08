
export interface iRamal {
    id_ramal: number;
    id_sociedade: number;
    id_setor: number;
    loja: string;
    ramal: string;
    nome: string;

}

export interface iParamToInsertRamal {
    id_sociedade: number;
    id_setor: number;
    ramal: string;
    nome: string;
}

export interface iParamToUpdateRamal {
    id_ramal: number;
    id_sociedade: number;
    id_setor: number;
    ramal: string;
    nome: string;
}

export interface iParamToGetRamal {
    offset: number;
    param: {
        id_ramal?: number;
        id_sociedade?: number;
        id_setor?: number;
        ramal?: string;
        nome?: string;
    };
}

export interface iGetDuplicityResponseRamal {
    ramal?: string;
    id_sociedade?: number;
    id_setor?: number;
}


export interface iSetor {
    id_setor: number;
    nome: string;

}

export interface iParamToInsertSetor {
    nome: string;
}

export interface iParamToUpdateSetor {
    id_setor: number;
    nome: string;
}

export interface iParamToGetSetor {
    offset: number;
    param: {
        id_setor?: number;
        nome?: string;
    };
}

export interface iToDeleteResponse {
    id_ramal?: number;
}
