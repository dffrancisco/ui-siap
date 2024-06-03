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