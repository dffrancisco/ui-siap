
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
    id_ramal: number;
}

export interface iParamToUpdateRamal extends iParamToInsertRamal {
    id_ramal: number;
}


export interface iParamToGetRamal {
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

export interface iSociedade {
    id_sociedade: number;
    loja: string;
}


export interface iFieldDuplicity {
    value: string;
    field: string;
}

export interface iToDeleteResponse {
    id_ramal?: number;
}

export interface iDadosInputs {
    setores: iSetor[];
    sociedade: iSociedade[];
}


