import utils from './../../ts/utils';
import moment from "moment";
import { reactive } from "vue";
import { iOptions } from "./interfaces";
import serviceConferenciaDeCaixa from "./services/conferenciaDeCaixa.service";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";

export const state = reactive({
    data: moment().format("YYYY-MM-DD"),
    selectedOption: "caixas",
    loading: false,
    mdcAberto: true,
    msgAberturaMDC: '',
    caixas: [],
});

export const options: iOptions[] = [
    { value: "caixas", label: "Caixas" },
    { value: "lancamentos", label: "Lançamentos" },
    { value: "sangria", label: "Sangria" },
    { value: "devolucao", label: "Devolução" },
];

export const actions = {
    async init() {
        await actions.getDadosIniciaisConfCaixa();
    },

    async getDadosIniciaisConfCaixa() {
        try {
            state.loading = true;
            let param = state.data;
            const data = await serviceConferenciaDeCaixa.getDadosIniciaisConfCaixa(param);

            if (data.mdc.length == 0) {
                state.mdcAberto = false;
            } else {
                state.mdcAberto = true;
                state.msgAberturaMDC = data.mdc[0].OPEN_CLOSE;
                state.caixas = data.caixas;
            }


        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }
    },


    async abrirMDC() {
        if (await msgConfirm("Confirmação", "Gostaria de Abrir o MDC do dia " + utils.dataBrasil(state.data) + "?")) {
            try {
                state.loading = true;
                await serviceConferenciaDeCaixa.abrirMDC(state.data);
                await actions.getDadosIniciaisConfCaixa();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao abrir o MDC!"
                });
            } finally {
                state.loading = false;
            }

        }
    },

    async abrirNovoCaixa() {

    },

    getFotoFuncionarioURL(cpf: string) {
        if (!cpf) {
            return "";
        }
        const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
        return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
    }
}
