import { mesesToSelect } from "@/constants/constants";
import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceRelatorioConferenciaAlteracoes from './services/relatorioConferencia.service';
import { iFuncionarios, iTelas } from "./interfaces";


export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || "",
    funcionarios: <iFuncionarios[]>[],
    selectedFuncionario: <number[]>[],
    telas: <iTelas[]>[],
    selectTela: <string[]>[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    dadosRelatorio: <any[]>[],
    mesImpressao: null,
    anoImpressao: null,
    headers: <any>[]
})

export const actions = {
    async init() {
        // actions.validarInputs()
        actions.getDadosParaInputs()
    },

    validarInputs() {
        if (state.ano === "" || state.ano > ano.toString()) {
            Swal.fire({
                icon: "error",
                text: "Insira um ano válido para continuar"
            });
            return
        }

        if (state.mes > mes) {
            Swal.fire({
                icon: "error",
                text: "Insira um mês válido para continuar"
            });
            return
        }
        actions.getDadosParaRelatorio();
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceRelatorioConferenciaAlteracoes.getDadosParaInputs();
            state.funcionarios = data.funcionarios
            state.telas = data.telas
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }
    },

    async getDadosParaRelatorio() {
        try {
            state.loading = true;

            const data = await serviceRelatorioConferenciaAlteracoes.getDadosParaRelatorio({
                page: state.page,
                itemsPerPage: state.itemsPerPage,
                mes: state.mes,
                ano: state.ano,
            });
            // state.dadosRelatorio = data.historicoConsultaLojas;
            // state.totalItems = data.total[0].TOTAL;

            state.mesImpressao = state.mes
            state.anoImpressao = state.ano

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as consultas lojas!"
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        // actions.getHistoricoConsultaLojas();
    },

    async onClickImprimir() { }
}