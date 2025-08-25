import axios from "axios";
import { reactive } from "vue";
import router from "../../router";
import actionsGlobal from "@/store/globalActions";
import { iLogin } from "../../models/interfaces";
import { block } from "../../ts/utils";
import stateGlobal from '@/store/globalState'
import swal from 'sweetalert2'
import mixpanel from "@/plugins/mixpanel";
import storeLogin from "@/pages/login/login";

type IUserMixpanel = {
    COD_FUNCIONARIO: number,
    CPF: string,
    LOGIN: string,
    NOME_COMP: string,
    CNPJ_EMPRESA: string,
    RAZAO_SOCIAL_EMPRESA: string,
}

export const state = reactive({
    nameStorage: "isAuth-" + stateGlobal.nomeSistema,
    login: <iLogin>{},
    auth: false,
    btnLoad: false,
});

export const actions = {
    setLogin(login: {
        email: string;
        id_master: string;
        name: string;
        phone: string;
        token: string;
    }) {
        //@ts-ignore
        state.login = login;
    },

    setAuth(auth: boolean) {
        state.auth = auth;
    },

    setUserMixpanel(user: IUserMixpanel) {
        mixpanel.identify(user.CPF); // Identifica o usuário no Mixpanel

        mixpanel.people.set({
            $nome: user.NOME_COMP,
            $cpf: user.CPF,
            $login: user.LOGIN,
            $cod_funcionario: user.COD_FUNCIONARIO,
            $cnpj: user.CNPJ_EMPRESA,
            $razao_social: user.RAZAO_SOCIAL_EMPRESA,
        });
    },

    getCPF() {
        if (state.login.CPF)
            return state.login.CPF.replaceAll(".", "").replaceAll("-", "");
    },

    formatarPermissoes() {
        let permissoes = localStorage.getItem("configuracoes" + stateGlobal.nomeSistema);
        let json = JSON.parse(permissoes);
        for (let i in json) {
            json[i] = json[i].permissao;
            delete json[i].permissao;
            delete json[i].descricao;
        }
        return json
    },

    async getLogin(cod_funcionario: string, senha: string, id_sociedade: string) {
        if (state.btnLoad) return;
        state.btnLoad = true;

        let rs = await axios.post("login", {
            call: "getLogin",
            id_sociedade: id_sociedade,
            param: {
                cod_funcionario: cod_funcionario,
                senha: senha,
                config: actions.formatarPermissoes(),
            },
        });

        state.btnLoad = false;

        if (rs.data.error) return rs.data;

        if (rs.data.token) {
            sessionStorage.setItem(
                state.nameStorage,
                JSON.stringify({ ...rs.data, siap: block("false") })
            );

            axios.defaults.headers.common["Authorization"] = rs.data.token;

            this.setLogin(rs.data);
            this.setAuth(true);

            actionsGlobal.getEmpresa();

            storeLogin.actions.setUserMixpanel({
                CPF: rs.data.CPF,
                LOGIN: rs.data.LOGIN,
                NOME_COMP: rs.data.NOME_COMP,
                COD_FUNCIONARIO: rs.data.COD_FUNCIONARIO,
                CNPJ_EMPRESA: stateGlobal?.empresa?.CGC_EMPRESA,
                RAZAO_SOCIAL_EMPRESA: stateGlobal?.empresa?.RAZAO_SOCIAL,
            })

            router.push("/home");

            return rs;
        }
    },

    logOut() {
        sessionStorage.removeItem("empresa" + stateGlobal.nomeSistema);
        sessionStorage.removeItem(state.nameStorage);
        sessionStorage.removeItem(stateGlobal.nomeSistema);

        this.setLogin({
            email: "",
            id_master: "",
            name: "",
            phone: "",
            token: "",
        });

        axios.defaults.headers.common["Authorization"] = null;

        this.setAuth(false);

        mixpanel.reset();

        // socketClient.disconnect();

        router.push("/login");
        window.location.reload();
    },

    async confirmarSaida() {

        let rs = await swal.fire({
            title: 'Sair do Sistema',
            text: "Deseja sair do sistema?",
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não',
            cancelButtonColor: '#ccdce3',
        })

        if (rs.isConfirmed)
            actions.logOut();
    }
};

export default {
    state,
    actions,
};
