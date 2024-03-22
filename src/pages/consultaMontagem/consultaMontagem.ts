import utils from "@/ts/utils";
import Swal from "sweetalert2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { computed, reactive } from "vue";
import { iMontagem, iMontagemDetalhes } from './interfaces'
import serviceConsultaMontagem from './services/consutaMontagem.service'
import moment from "moment";

export const itemsToTable = computed(() => {
    let totalVendas = 0;
    let totalDevolucoes = 0;
    let valorTotal = 0;

    state.dbMontagem.forEach(venda => {
        totalVendas += venda.VALOR;
        valorTotal += venda.TOTAL;
        totalDevolucoes += venda.VALOR_DEVOLUCAO;
    });

    if (state.dbMontagem.length > 0) {
        let totalizador = {
            LOGIN: 'Totalizador',
            VALOR: totalVendas,
            VALOR_DEVOLUCAO: totalDevolucoes,
            TOTAL: valorTotal
        }

        state.dbMontagem.push(totalizador)
    }

    return state.dbMontagem
})

export const dadosFormatToPrint = computed(() => {
    let dadosToPrint = state.dbMontagem

    return dadosToPrint.map(venda => ({
        ...venda,
        VALOR: utils.formatValor(venda.VALOR),
        DEVOLUCAO: utils.formatValor(venda.VALOR_DEVOLUCAO),
        VALOR_TOTAL: utils.formatValor(venda.TOTAL),
    }));
})

export const state = reactive({
    headers: <any>[
        { title: 'Montador', key: 'LOGIN', width: '30%' },
        { title: 'Valor', key: 'VALOR', value: (montagem: iMontagem) => utils.formatValor(montagem.VALOR) },
        { title: 'Devolução', key: 'VALOR_DEVOLUCAO', value: (montagem: iMontagem) => utils.formatValor(montagem.VALOR_DEVOLUCAO) },
        { title: 'Total', key: 'TOTAL', value: (montagem: iMontagem) => utils.formatValor(montagem.TOTAL) },
        { title: 'Inf', key: 'inf', sortable: false },
    ],

    dbMontagem: <iMontagem[]>[],
    dbMontagensDetalhes: <iMontagemDetalhes>{},

    dataInicial: moment().startOf('month').format('YYYY-MM-DD'),
    dataFinal: moment().endOf('month').format('YYYY-MM-DD'),

    dataInicialModal: null,
    dataFinalModal: null,

    idMontador: null,

    modalMontagemInf: <iModalCreate>{},
    modalMontagemInfOpened: false,

    elDataFinal: <HTMLInputElement>{},
    loading: false,
})

export const actions = {
    pesquisarMontagens() {
        setTimeout(() => {
            if (!state.dataInicial || !state.dataFinal) {
                Swal.fire({
                    text: "Data inicial ou data final não preenchidos",
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

            actions.getMontagens()
        }, 100)
    },

    async init() {
        state.elDataFinal = <any>document.getElementById("elDataFinal");
    },

    criarModais(nameMontador: string) {
        state.modalMontagemInf = new xModal.create({
            el: '#modalMontagemInf',
            height: 730,
            width: 900,
            title: nameMontador,
            theme: 'xModal-blue',
            onOpen: () => { state.modalMontagemInfOpened = true },
            onClose: () => { state.modalMontagemInfOpened = false, state.modalMontagemInf.destroy() }
        })
    },

    async openModal(id_montador: number, nameMontador: string) {
        state.idMontador = id_montador
        await actions.getMontagemDetalhes(id_montador)
        actions.criarModais(nameMontador);

        state.modalMontagemInf.open();
    },

    async getMontagens() {
        try {

            state.loading = true;

            let param = {
                dataInicio: state.dataInicial,
                dataFim: state.dataFinal
            }

            const data = await serviceConsultaMontagem.getMontagens(param)

            state.dbMontagem = data

            state.dataInicialModal = state.dataInicial
            state.dataFinalModal = state.dataFinal

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao exibir as montagens!",
            })
        }
    },

    async getMontagemDetalhes(id_montador: number) {
        try {
            let param = {
                dataInicio: state.dataInicialModal,
                dataFim: state.dataFinalModal,
                ID_MONTADOR: id_montador,
            };

            state.loading = true;
            const data = await serviceConsultaMontagem.getMontagemDetalhes(param);
            state.dbMontagensDetalhes = data

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as informações dos detalhes do montador!"
            });
        }
    },
}

export default { state, actions }