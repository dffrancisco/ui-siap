
import { iGetLojasResponse } from "./interfaces";
import { reactive } from "vue";
import Swal from "sweetalert2";
import serviceTelaCPD from './services/telaCPD.services'
import toast from "@/plugins/toast/toast";


export const state = reactive({
    lojas: <iGetLojasResponse[]>[],
    password: '',
    loading: false,
    loggedIn: false,
    Lojaselecionada: null,
})

export const actions = {
    async init() {
        await actions.getLojas();
    },

    async getLojas() {
        try {
            state.lojas = await serviceTelaCPD.getLojas();
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar lojas',
                icon: "error"
            });
        }
    },

    async login(password: string) {
        const correctPassword = import.meta.env.VITE_CPD_PASSWORD;
        state.loading = true;
        try {
            if (password === correctPassword) {
                state.loggedIn = true;
                toast.success('Login bem-sucedido!');
                return true;
            } else {
                toast.warning('Senha incorreta!');
                return false;
            }
        } catch (error: any) {
            toast.error('Erro ao realizar login');
            return false;
        } finally {
            state.loading = false;
        }
    },

    logout() {
        state.loggedIn = false;
        state.password = '';
        state.Lojaselecionada = null;
    },

    onClickBotao(valor: number, tipo: string) {
        state.Lojaselecionada = valor;
        if (!state.Lojaselecionada) {
            toast.warning("Selecione uma loja antes de continuar");
            return;
        }
        let url = "";
        switch (tipo) {
            case "liberarCredito":
                url = `http://192.168.100.60/siap+/?p=frame/frame&page=desbloqueioCredito&tolk=${state.Lojaselecionada}`;
                break;
            case "devolucaoManual":
                url = `http://192.168.100.60/siap+/?p=frame/frame&page=devolucaoManualCaixa&tolk=${state.Lojaselecionada}`;
                break;
            case "recalcularDesconto":
                url = `http://192.168.100.60/siap+/?p=frame/frame&page=recalcularDesconto&tolk=${state.Lojaselecionada}`;
                break;
            default:
                alert("Ação desconhecida");
                return;
        }
        window.open(url, "_blank");
    }
};
