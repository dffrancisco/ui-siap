import utils from "@/ts/utils";
import Swal from "sweetalert2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { computed, reactive } from "vue";
import { iMontagem } from './interfaces'
import serviceConsultaMontagem from './services/consutaMontagem.service'
import moment from "moment";

export const dadosFormatToPrint = computed(() => {
    return state.dbMontagem.map(venda => ({
        ...venda,
        VALOR: utils.formatValor(venda.VALOR),
        DEVOLUCAO: utils.formatValor(venda.DEVOLUCAO),
        VALOR_TOTAL: utils.formatValor(venda.VALOR_TOTAL),
    }));
})

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
    idMontador: null,

    modalMontagemInf: <iModalCreate>{},
    modalMontagemInfOpened: false,

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

    async init() {
        actions.criarModais()
    },

    criarModais() {
        state.modalMontagemInf = new xModal.create({
            el: '#modalMontagemInf',
            height: 700,
            width: 900,
            theme: 'xModal-blue',
            onOpen: () => { state.modalMontagemInfOpened = true },
            onClose: () => { state.modalMontagemInfOpened = false }
        })
    },

    openModal(id_montador: number) {
        state.idMontador = id_montador
        state.modalMontagemInf.open();
    },

    async getRelatorioMontagens() {
        try {

            state.loading = true;

            let param = {
                dataInicio: state.dataInicial,
                dataFim: state.dataFinal
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