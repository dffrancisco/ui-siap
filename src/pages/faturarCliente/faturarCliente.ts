import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { computed, reactive } from "vue";
import { iClienteFaturado, iGetOrcamentosClienteFaturadoParam, iOrcamentosClienteFaturado, iOrcamentosLocalizados } from "./interfaces";
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
    orcamentosLocalizados: <iOrcamentosLocalizados[]>[],
    inputLocOrcElement: <HTMLInputElement>null
})

export const actions = ({
    async init() {
        actions.criarGrid()
        state.inputLocOrcElement = document.getElementById('inputLocOrc') as HTMLInputElement
    },

    criarGrid() {
        state.gridPedido = new xGridV2.create({
            el: "#gridOrcamentosClienteFaturado",
            count: true,
            height: 380,
            columns: {
                'Orç.': { dataField: 'NUM_ORCAMENTO', center: true, width: '10%' },
                'Nota Fiscal': { dataField: 'NUM_NFE', center: true, width: '10%' },
                'Cliente': { dataField: 'NOME', width: '40%' },
                'Data': { dataField: 'DATA', render: utils.dataBrasil, center: true, width: '15%' },
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
        state.orcamentosLocalizados = []
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

            state.gridPedido.source(data)
            state.dbOrcamentosClienteFaturado = data
            state.inputLocOrcElement.focus()

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
        let isDevolucao = state.locValor.toUpperCase().startsWith('DEV') ? true : false

        if (!isOrcamento && !isDevolucao) {
            Swal.fire({
                icon: "error",
                text: "Orçamento inválido!"
            })
        }

        if (isOrcamento) {

            let num_orcamento = state.locValor.slice(1)
            let orcamento: iOrcamentosLocalizados = state.dbOrcamentosClienteFaturado.find((orc) =>
                orc.NUM_ORCAMENTO == num_orcamento
            )

            if (!orcamento) {
                Swal.fire({
                    icon: "error",
                    text: "Orçamento não encontrado!"
                })

                state.locValor = null

                return
            }

            document.querySelectorAll('.xGridV2-col[name="NUM_ORCAMENTO"]').forEach(col => {
                if (col.textContent.trim() == num_orcamento) {
                    const parentRow = col.closest('.xGridV2-row') as HTMLBodyElement;
                    if (parentRow) {
                        parentRow.style.backgroundColor = '#4ade80';
                        parentRow.style.color = 'black';
                    }

                    orcamento = {
                        ...orcamento,
                        ISDEVOLUCAO: false
                    }

                    state.orcamentosLocalizados.push(orcamento)
                }
            });
        }

        if (isDevolucao) {

            let num_devolucao = state.locValor.slice(3)

            let orcamento: iOrcamentosLocalizados = state.dbOrcamentosClienteFaturado.find((orc) => orc.NUM_DEVOLUCAO == num_devolucao)

            if (orcamento) {
                orcamento = {
                    ...orcamento,
                    ISDEVOLUCAO: true
                }

                state.orcamentosLocalizados.push(orcamento)

            } else {
                Swal.fire({
                    icon: "error",
                    text: "Orçamento de devolução não encontrado!"
                })
            }
        }

        state.locValor = null
    }

})

export const computeds = ({
    totalValorOrcamentos: computed(() => {
        return state.dbOrcamentosClienteFaturado.reduce((total, orcamento) => total + (orcamento.VALOR - orcamento.DEVOLUCAO), 0)
    }),

    calcularOrcamentosLocalizados: computed(() => {

        let total = 0;
        let qtdOrcamentos = 0

        if (state.orcamentosLocalizados.length == 0) {
            return { total, qtdOrcamentos }
        }

        state.orcamentosLocalizados.forEach(orcamento => {
            total += orcamento.VALOR - orcamento.DEVOLUCAO;

            if (!orcamento.ISDEVOLUCAO) {
                qtdOrcamentos++;
            }
        });

        return { total, qtdOrcamentos };
    })

})