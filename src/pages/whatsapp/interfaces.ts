export interface iUsuario {
    assigned_user: string;
    nome: string;
}

export interface iConversaAberta {
    uuid_contato: string;
    telefone: string;
    data_hora_aberto: string;
    tags: string;
    data_hora_humano: string;
    assigned_user: string;
    nome: string;
}

export interface iDadosContatos {
    telefone: string,
    nome: string;
    uuid_contato: string;
    msgs: iMsgCallbell[],
    meta: {
        page: number;
        pages: number;
    }
}

export interface iMsgCallbell {
    attachments?: [{
        type: string;
        payload: {
            url: string,
            meta: {
                caption: string
            }
        }
    }],
    text: string,
    createdAt: string,
    status: string,
    channel: string,
    from: string,
    to: string
}

export interface iGetMsgsCallbellResponse {
    messages: iMsgCallbell[];
    meta: {
        page: number;
        pages: number;
    }
}

export interface iMsgFormatada {
    text?: string,
    type?: number,
    hora?: string,
    user?: string,
    url?: string
}