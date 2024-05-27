import Swal from "sweetalert2";
import { reactive, computed } from "vue";
import whatsappPerformanceService from "./services/whatsappPerformance.service";
import moment from "moment";
import { iAtendimentoIniciado, iAtendimentoFinalizado, iTotalizadores } from "./interfaces";
import router from "@/router";

export const state = reactive({
    loading: false,
    atendimentosIniciados: <iAtendimentoIniciado[]>[],
    atendimentosFinalizados: <iAtendimentoFinalizado[]>[],
    edtDataInicio: moment().format('YYYY-MM-DD'),
    edtDataFim: moment().format('YYYY-MM-DD'),
    totalizadores: <iTotalizadores>{},
    inputDataFim: <HTMLInputElement>{},
})

export const actions = {
    async buscarDados() {
        if (moment(state.edtDataInicio).isAfter(moment(state.edtDataFim))) {
            await Swal.fire({
                icon: 'error',
                text: 'Data inicial não pode ser maior que data final.',
            })
            return;
        }

        state.loading = true;

        try {
            let promise1 = actions.getRelatorioAtendimentosIniciados();
            let promise2 = actions.getRelatorioAtendimentosFinalizados();
            let promise3 = actions.getTotalizadores();

            await Promise.all([promise1, promise2, promise3])
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

    async getTotalizadores() {
        try {
            const data = await whatsappPerformanceService.getTotalizadores(state.edtDataInicio, state.edtDataFim);
            state.totalizadores = data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar os totalizadores.',
            })
        }
    },

    redirectToWhatsapp() {
        router.push('/whatsapp')
    },

    async init() {
        state.inputDataFim = <any>document.getElementById("inputDataFim");
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
    }),
    qtdAtendimentosPorEstadoOrdenado: computed(() => {
        if (!state.totalizadores.tagsAtendimento) {
            return {
                labels: [],
                series: [],
            };
        }

        let atendimentosPorEstado = {
            DF: 0,
            GOIANIA: 0,
            'OUTRO ESTADO': 0,
            DESCONHECIDO: 0
        };

        state.totalizadores.tagsAtendimento.forEach(item => {
            let tag = item.tags;

            if (tag.includes('DF')) {
                atendimentosPorEstado['DF']++;
            }

            if (tag.includes('GOIANIA')) {
                atendimentosPorEstado['GOIANIA']++;
            }

            if (tag.includes('OUTRO ESTADO')) {
                atendimentosPorEstado['OUTRO ESTADO']++;
            }
        });

        let totalGeral = state.totalizadores.tagsAtendimento.length;

        atendimentosPorEstado['DESCONHECIDO'] = totalGeral - (
            atendimentosPorEstado['DF'] +
            atendimentosPorEstado['GOIANIA'] +
            atendimentosPorEstado['OUTRO ESTADO']
        );

        let labels = Object.keys(atendimentosPorEstado);
        let series = Object.values(atendimentosPorEstado);

        return {
            labels: labels,
            series: series,
        };
    }),


    tempoMedioEsperaFormatado: computed(() => {
        const minutos = state.totalizadores.tempoMedioEspera;
        const duracao = moment.duration(minutos, 'minutes');
        const horas = duracao.hours();
        const minutosRestantes = duracao.minutes();

        return `${horas}h ${minutosRestantes}min`;
    }),

    tempoMedioAtendimentoFormatado: computed(() => {
        const minutos = state.totalizadores.tempoMedioAtendimento;
        const duracao = moment.duration(minutos, 'minutes');
        const horas = duracao.hours();
        const minutosRestantes = duracao.minutes();

        return `${horas}h ${minutosRestantes}min`;
    })
}

export default { state, actions }