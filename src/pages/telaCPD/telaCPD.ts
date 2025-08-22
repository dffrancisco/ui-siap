
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
    selecLoja: null,
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
        const correctPassword = 'suporteTI'
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
        state.selecLoja = null;
    },

    onclickrLiberarCredito(valor: number) {
        state.selecLoja = valor;
        if (!state.selecLoja) {
            alert("Selecione uma loja antes de continuar");
            return;
        }
        const url = `http://192.168.100.60/siap+/?p=frame/frame&page=desbloqueioCredito&tolk=${state.selecLoja}`;
        window.open(url, "_blank");
    },

    onclickrDevolucaoManual(valor: number) {
        state.selecLoja = valor;
        if (!state.selecLoja) {
            alert("Selecione uma loja antes de continuar");
            return;
        }
        const url = `http://192.168.100.60/siap+/?p=frame/frame&page=devolucaoManualCaixa&tolk=${state.selecLoja}`;
        window.open(url, "_blank");
    },
};
