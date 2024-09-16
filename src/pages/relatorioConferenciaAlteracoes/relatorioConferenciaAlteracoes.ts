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
    conteudo: ['Conferido', 'Quantidade', 'End.Estoque', 'End.Excesso'],
    selectTela: <string[]>[],
    selectedConteudo: <string[]>[],
    numFabricante: "",
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
        actions.validarInputs()
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
                conteudo: state.selectedConteudo,
                tela: state.selectTela,
                numFabricante: state.numFabricante,
                funcionario: state.selectedFuncionario

            });
            state.dadosRelatorio = data;
            state.totalItems = data.total[0].TOTAL;

            state.mesImpressao = state.mes
            state.anoImpressao = state.ano

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados para relatório!"
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
        actions.getDadosParaRelatorio();

        // async verMais() {

        //     try {
        //         state.loading = true;
        //         const nextPage = Math.ceil(state.clientesFila.length / state.itemsPerPage) + 1;
        //         const data = await pranchetaService.getClientesFila({
        //             page: nextPage,
        //             itemsPerPage: state.itemsPerPage,
        //             search: state.search,
        //             filtroStatus: state.filtroStatus,
        //         });

        //         // Concatenar os novos clientes com os existentes
        //         const updatedClientesFila = [...state.clientesFila, ...data.clientesFila];

        //         state.clientesFila = updatedClientesFila;
        //         state.totalItems = data.total[0].TOTAL;
        //     } catch (error) {
        //         Swal.fire({
        //             icon: "error",
        //             text: "Erro ao carregar mais clientes!"
        //         });
        //     } finally {
        //         state.loading = false;
        //         actions.esconderTeclado();
        //     }
        // },
    },

    async onClickImprimir() { }
}