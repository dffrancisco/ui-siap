export interface iCliente {
    ID_CLIENTE: number;
    NOME: string;
    CGC_CLIENTE: string;
    BLOQUEADO: number;
}

export interface iBloqueioCliente {
    ID_CLIENTE: number;
    DATA_BLOQUEIO: Date;
    DATA_DESBLOQUEIO: Date;
    OBS: string;
}

export interface iBloqueioClienteForm {
    OBS: string;
}

export interface iParamGetCliente {
    offset: number;
    param: object
}

export interface iParamGetBloqueioCliente {
    offset: number;
    param: object
}

export interface iParamBloquearCliente {
    ID_CLIENTE: number;
    OBS: string;
}

export interface iParamDesbloquearCliente {
    ID_CLIENTE: number;
    DATA_BLOQUEIO: Date;
}

export interface iGetClientesResponse extends iCliente{}
export interface iGetBloqueioClienteResponse extends iBloqueioCliente{}
export interface iBloquearClienteResponse extends iBloqueioCliente{}
export interface iDesbloquearClienteResponse extends iBloqueioCliente{}