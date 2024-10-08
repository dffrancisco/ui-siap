export interface iBanco {
    DS_BANCO: string;  
    CD_BANCO: string;  
    SG_BANCO: string;  
}

export interface iParamToInsert {
    DS_BANCO: string;  
    CD_BANCO: string;  
    SG_BANCO: string;  
}

export interface iParamGetBanco {
    offset: number; 
    param: {
        DS_BANCO?: string;  
        CD_BANCO?: string;  
        SG_BANCO?: string;   
    };
}

export interface iInsertResponse {
    CD_BANCO: string;
}

export interface iGetDuplicityResponse {
    SG_BANCO?: string;  
    DS_BANCO?: string;  
    CD_BANCO?: string;  
}

export interface iFieldDuplicity {
    value: string; 
    field: string;
}


export interface iBancoResponse extends iBanco {} 
export interface iParamToUpdate extends iBanco {}  

export interface iToDeleteResponse {
    delete: string
}
