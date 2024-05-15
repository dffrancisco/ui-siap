import Swal from "sweetalert2";
import { reactive, computed } from "vue";
import whatsappPerformanceService from "./services/whatsappPerformance.service";
import moment from "moment";
import { iAtendimentoIniciado, iAtendimentoFinalizado } from "./interfaces";
import router from "@/router";

export const state = reactive({
    loading: false,
    atendimentosIniciados: <iAtendimentoIniciado[]>[],
    atendimentosFinalizados: <iAtendimentoFinalizado[]>[],
    edtDataInicio: moment().format('YYYY-MM-DD'),
    edtDataFim: moment().format('YYYY-MM-DD'),
})

export const actions = {
    async buscarDados() {
        state.loading = true;
        try {
            let promise1 = actions.getRelatorioAtendimentosIniciados();
            let promise2 = actions.getRelatorioAtendimentosFinalizados();

            await Promise.all([promise1, promise2])
        } finally {
            state.loading = false;
        }
    },

    async getRelatorioAtendimentosIniciados() {
        try {
            state.atendimentosIniciados = await whatsappPerformanceService.getRelatorioAtendimentosIniciados(state.edtDataInicio, state.edtDataFim);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar relatório atendimentos iniciados.',
            })
        }
    },

    async getRelatorioAtendimentosFinalizados() {
        try {
            state.atendimentosFinalizados = await whatsappPerformanceService.getRelatorioAtendimentosFinalizados(state.edtDataInicio, state.edtDataFim);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar relatório atendimentos finalizados.',
            })
        }
    },

    redirectToWhatsapp() {
        router.push('/whatsapp')
    },

    async init() {
        actions.buscarDados();
    },
}

export const computeds = {
    chartEmAndamento: computed(() => {
        let seriesQtdRecebida = [];
        let seriesQtdEnviada = [];
        let usuarios = [];

        state.atendimentosIniciados
            .sort((atendimentoA, atendimentoB) => atendimentoB.qtd_total - atendimentoA.qtd_total)
            .forEach(atendimento => {
                if (!atendimento.assigned_user) return;

                seriesQtdRecebida.push(atendimento.qtd_recebida);
                seriesQtdEnviada.push(atendimento.qtd_enviada);
                usuarios.push(atendimento.nome);
            })

        return {
            series: {
                qtdRecebida: seriesQtdRecebida,
                qtdEnviada: seriesQtdEnviada,
            },
            labels: usuarios
        }
    }),

    chartFinalizado: computed(() => {
        let seriesQtdRecebida = [];
        let seriesQtdEnviada = [];
        let usuarios = [];

        state.atendimentosFinalizados
            .sort((atendimentoA, atendimentoB) => atendimentoB.qtd_total - atendimentoA.qtd_total)
            .forEach(atendimento => {
                seriesQtdRecebida.push(atendimento.qtd_recebida);
                seriesQtdEnviada.push(atendimento.qtd_enviada);
                usuarios.push(atendimento.nome);
            })

        return {
            series: {
                qtdRecebida: seriesQtdRecebida,
                qtdEnviada: seriesQtdEnviada,
            },
            labels: usuarios
        }
    }),

    totalizadores: computed(() => {
        let qtdTotalRecebida = 0;
        let qtdTotalEnviada = 0;

        state.atendimentosIniciados.forEach(atendimento => {
            qtdTotalRecebida += atendimento.qtd_recebida;
            qtdTotalEnviada += atendimento.qtd_enviada;
        })

        return {
            totalGeral: qtdTotalRecebida + qtdTotalEnviada,
            enviada: qtdTotalEnviada,
            recebida: qtdTotalRecebida,
        }
    })
}

export default { state, actions }