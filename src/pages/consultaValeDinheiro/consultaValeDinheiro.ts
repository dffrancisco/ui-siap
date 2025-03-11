import { mesesToSelect } from "@/constants/constants";
import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceRelatorioConferenciaAlteracoes from './services/consultaValeDinheiro.service';
import { iFuncionarios } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";


export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || "",
    funcionarios: <iFuncionarios[]>[],
    selectedFuncionario: <number[]>[],

})

export const actions = {
    async init() {
        actions.validarInputs()
        actions.getDadosParaInputs()
    },

    validarInputs() {

    },

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceRelatorioConferenciaAlteracoes.getDadosParaInputs();
            state.funcionarios = data.funcionarios

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }
    },



    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },




}