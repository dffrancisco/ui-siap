export interface iGetLojasFunction {
    ID_EMPRESA: number;
    FANTASIA: string;

};

export interface iGetLojasResponse {
    ID_EMPRESA: number;
    FANTASIA: string;
};
interface Loja {
    id: number
    nome: string
}

interface State {
    password: string
    loading: boolean
    loggedIn: boolean

    lojas: Loja[]
    selectedStore: number | null
}