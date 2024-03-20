import utils from "@/ts/utils";
import Swal from "sweetalert2";
import { reactive } from "vue";
import { iMontagem } from './interfaces'
import serviceConsultaMontagem from './services/consutaMontagem.service'
import moment from "moment";

export const state = reactive({
    headers: <any>[
        { title: 'Montador', key: 'LOGIN', width: '30%' },
        { title: 'Valor', key: 'VALOR', value: (montagem: iMontagem) => utils.formatValor(montagem.VALOR) },
        { title: 'Devolução', key: 'DEVOLUCAO', value: (montagem: iMontagem) => utils.formatValor(montagem.DEVOLUCAO) },
        { title: 'Total', key: 'VALOR_TOTAL', value: (montagem: iMontagem) => utils.formatValor(montagem.VALOR_TOTAL) },
        { title: 'Inf', key: 'inf', sortable: false },
    ],

    dbMontagem: <iMontagem[]>[],

    dataInicial: null,
    dataFinal: null,

    loading: false,
})

export const actions = {
    pesquisarMontagens() {
        if (!state.dataInicial || !state.dataFinal) {
            Swal.fire({
                text: "Data inicial e/ou data final não preenchidos",
                icon: "warning"
            })
            return false
        }

        if (moment(state.dataInicial).isAfter(moment(state.dataFinal))) {
            Swal.fire({
                text: "Data inicial deve ser menor que a data final",
                icon: "warning"
            })
            return false
        }

        actions.getRelatorioMontagens()
    },

    async getRelatorioMontagens() {
        try {

            state.loading = true;

            let param = {
                dataInicio: moment(state.dataInicial).format('DD.MM.YYYY'),
                dataFim: moment(state.dataFinal).format('DD.MM.YYYY')
            }

            const data = await serviceConsultaMontagem.getRelatorioMontagens(param)

            state.dbMontagem = data

            let totalVendas = 0;
            let totalDevolucoes = 0;

            state.dbMontagem.forEach(venda => {
                totalVendas += venda.VALOR;
                if (venda.DEVOLUCAO) {
                    totalDevolucoes += venda.DEVOLUCAO;
                }
            });

            if (state.dbMontagem.length > 0) {
                let totalizador = {
                    LOGIN: 'Totalizador',
                    VALOR: totalVendas,
                    DEVOLUCAO: totalDevolucoes,
                    VALOR_TOTAL: totalVendas - totalDevolucoes
                }

                state.dbMontagem.push(totalizador)
            }


            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as montagens!",
            })
        }
    }
}

export default { state, actions }