
export interface iGetLojasResponse {
    ID_EMPRESA: number;
    FANTASIA: string;
};
interface Loja {
    id: number
    nome: string
}

interface login {
    password: string
    loading: boolean
    loggedIn: boolean
    selectedStore: number | null
}