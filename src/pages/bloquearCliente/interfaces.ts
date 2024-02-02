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