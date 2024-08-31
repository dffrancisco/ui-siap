import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { computed, reactive } from "vue";
import { iClienteFaturado, iGetOrcamentosClienteFaturadoParam, iOrcamentosClienteFaturado } from "./interfaces";
import serviceFaturarCliente from "./services/faturarCliente.service";
import Swal from "sweetalert2";
import utils from "@/ts/utils";

export const state = reactive({
    gridPedido: <ixGridCreate>{},
    dataLimite: moment().format('YYYY-MM-DD'),
    modalSelecionarClienteOpened: false,
    dbClienteFaturado: <iClienteFaturado>{},
    loading: false,
    dbOrcamentosClienteFaturado: <iOrcamentosClienteFaturado[]>[],
    locValor: null,
    orcamentosLocalizados: <number[]>[]
})

export const actions = ({
    async init() {
        actions.criarGrid()
    },

    criarGrid() {
        state.gridPedido = new xGridV2.create({
            el: "#gridOrcamentosClienteFaturado",
            count: true,
            height: 380,
            columns: {
                'Orç.': { dataField: 'NUM_ORCAMENTO', center: true, width: '10%' },
                'Nota Fiscal': { dataField: 'NUM_NFE', center: true, width: '10%' },
                'Cliente': { dataField: 'NOME', width: '35%' },
                'Data': { dataField: 'DATA', render: utils.dataBrasil, center: true },
                'Devolução': { dataField: 'DEVOLUCAO', render: utils.formatValor, right: true },
                'Valor': { dataField: 'VALOR', render: utils.formatValor, right: true }
            },
        })
    },

    closeModal() {
        state.modalSelecionarClienteOpened = false
    },

    async selecionarCliente(cliente: iClienteFaturado) {
        state.dbClienteFaturado = cliente
        await actions.getOrcamentosClienteFaturado()
    },

    async getOrcamentosClienteFaturado() {
        try {
            state.loading = true

            let param: iGetOrcamentosClienteFaturadoParam = {
                dataLimite: state.dataLimite,
                id_cliente: state.dbClienteFaturado.ID_CLIENTE
            }

            const data = await serviceFaturarCliente.getOrcamentosClienteFaturado(param)

            state.gridPedido.clear()
            state.gridPedido.querySourceAdd(data)
            state.dbOrcamentosClienteFaturado = data

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os orçamentos do cliente!"
            })
        } finally {
            state.loading = false
        }
    },

    locValorOrcamento() {

        let isOrcamento = state.locValor.startsWith('+') ? true : false
        let isDevolucao = state.locValor.startsWith('DEV') ? true : false

        if (isOrcamento) {

            let orcamento = state.locValor.slice(1)

            document.querySelectorAll('.xGridV2-col[name="NUM_ORCAMENTO"]').forEach(col => {
                if (col.textContent.trim() == orcamento) {
                    const parentRow = col.closest('.xGridV2-row') as HTMLBodyElement;
                    if (parentRow) {
                        parentRow.style.backgroundColor = '#4ade80';
                        parentRow.style.color = 'black';
                    }

                    state.orcamentosLocalizados.push(orcamento)

                    state.locValor = null
                }
            });
        }

        if (isDevolucao) {
            document.querySelectorAll('.xGridV2-col[name="DEVOLUCAO"]').forEach(col => {
                if ('DEV' + col.textContent.trim() == state.locValor) {
                    const parentRow = col.closest('.xGridV2-row') as HTMLBodyElement;
                    if (parentRow) {
                        parentRow.style.backgroundColor = '#4ade80';
                        parentRow.style.color = 'black';
                    }

                    state.locValor = null
                }
            });
        }
    }

})

export const computeds = ({
    totalValorOrcamentos: computed(() => {
        return state.dbOrcamentosClienteFaturado.reduce((total, orcamento) => total + orcamento.VALOR, 0)
    }),

    somatorio: computed(() => {

        let total = 0;

        if (state.orcamentosLocalizados.length == 0) {
            return total;
        }

        state.orcamentosLocalizados.forEach(num_orcamento => {

            let orcamento = state.dbOrcamentosClienteFaturado.find((orc) => orc.NUM_ORCAMENTO == num_orcamento);

            if (orcamento) {
                total += orcamento.VALOR
            }
        });

        return total;
    })

})