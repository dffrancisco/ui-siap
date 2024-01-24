export interface iMarcas {
    ID_MARCA: number;
    DESCRICAO: string;
    GRUPO: string;
    ID_MARCA_GRUPO: number;
};

export interface iParamGetMarcas{
    offset: number;
    param: object
};

export interface iMarcasResponse{
    ID_MARCA_GRUPO?: number;
    DESCRICAO: string
};

export interface iGruposMarcas{
    ID_MARCA_GRUPO?: number;
    GRUPO: string;
};

export interface iParamToInsert{
    param: any;
};

export interface iGetDuplicityResponse{
    DESCRICAO: string;
};

export interface iFieldDuplicity{
    field: string;
    value: string;
};