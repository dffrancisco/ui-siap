export interface iOptions {
    value: string;
    label: string;
}

export interface iMDC {
    STATOS: string;
    DATA: string;
    OPEN_CLOSE: string;
}

export interface iResponseDadosIniciais {
    mdc: iMDC[];
    caixas: any[];
}