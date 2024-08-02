import { computed, reactive } from "vue";
import metasService from './services/metas.service'
import Swal from "sweetalert2";
import { iDadosMetaCard, iGetMetasTracada, iGetMetasTracadaParam, iGetValoresParam, iValores } from "./interfaces";
import moment from "moment";

export const state = reactive({
    metasTracada: <iGetMetasTracada>{},
    valores: <iValores>{},
    data: moment().format('YYYY-MM-DD'),
    loading: false
})

export const actions = {
    async init() {
        // await actions.getMetasTracadas()
        // await actions.getValores()
    },

    async btnPesquisarMetas() {
        let dataIsValid = moment(state.data).isValid();

        if (!dataIsValid) {
            Swal.fire({
                icon: "warning",
                text: "Data inválida."
            })
            return;
        }

        await actions.getMetasTracadas()

        if (!state.metasTracada) {
            Swal.fire({
                icon: "info",
                text: "Nenhuma meta encontrada para a data informada."
            })
            return;
        }

        await actions.getValores()
    },

    async getMetasTracadas() {
        try {
            state.loading = true

            let param: iGetMetasTracadaParam = {
                data: state.data,
            }

            const data = await metasService.getMetasTracada(param)

            state.metasTracada = data[0];

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas traçadas."
            })
        } finally {
            state.loading = false
        }
    },

    async getValores() {
        try {
            state.loading = true

            let param: iGetValoresParam = {
                data: state.data,
                noturno: computeds.lojaIsNoturna.value
            }

            const data = await metasService.getValores(param)

            state.valores = data;

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os valores."
            })
        } finally {
            state.loading = false
        }
    },

    calcularPorcentagem(venda: number, meta: number) {
        let porcentagem = Number(((venda / meta) * 100).toFixed(2))

        if (isNaN(porcentagem) || !isFinite(porcentagem)) {
            porcentagem = 0
        }

        console.log(porcentagem);


        return porcentagem;
    }
}

export const computeds = {
    lojaIsNoturna: computed(() => {
        let lojaNoturna: 'S' | 'N' = 'N';

        if (state.metasTracada.geral_noite > 0) {
            lojaNoturna = 'S';
        }

        return lojaNoturna;
    }),

    dadosToMetaCardGeral: computed(() => {
        const {
            geral, mercado, montagem, mecanica, ticket_medio
        } = state.metasTracada

        const cardConfig: iDadosMetaCard[] = [
            {
                nomeCard: 'Meta Geral', valorGeral: geral, backgroudColor: '#DBEAFE', progressColor: '#60A5FA',
                porcentagem: actions.calcularPorcentagem(state.valores.vendasAcu, geral),
                valorDiaria: state.valores.vendas, valorAcumulado: state.valores.vendasAcu

            },
            {
                nomeCard: 'Meta Mercado', valorGeral: mercado, backgroudColor: '#FCE7F3', progressColor: '#F472B6',
                porcentagem: actions.calcularPorcentagem(state.valores.mercadoAcu, mercado),
                valorAcumulado: state.valores.mercadoAcu, valorDiaria: state.valores.mercado
            },
            {
                nomeCard: 'Meta Montagem', valorGeral: montagem, backgroudColor: '#D1FAE5', progressColor: '#34D399',
                porcentagem: actions.calcularPorcentagem(state.valores.montagemAcu, montagem),
                valorAcumulado: state.valores.montagemAcu, valorDiaria: state.valores.montagem
            },
            {
                nomeCard: 'Meta Mecânica', valorGeral: mecanica, backgroudColor: '#FEF3C7', progressColor: '#FBBF24',
                porcentagem: actions.calcularPorcentagem(state.valores.mecanicaAcu, mecanica),
                valorAcumulado: state.valores.mecanicaAcu, valorDiaria: state.valores.mecanica
            },
            {
                nomeCard: 'Ticket Médio', valorGeral: ticket_medio, backgroudColor: '#FEE2E2', progressColor: '#F87171',
                porcentagem: actions.calcularPorcentagem(state.valores.ticketMedioAcu, ticket_medio),
                valorAcumulado: state.valores.ticketMedioAcu, valorDiaria: state.valores.ticketMedio
            }
        ]

        return cardConfig
    })
}