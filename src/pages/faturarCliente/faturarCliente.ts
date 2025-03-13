import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { computed, reactive } from "vue";
import { iClienteFaturado, iCreditoCliente, iGetCreditosClienteParam, iGetOrcamentosClienteFaturadoParam, iOrcamentosClienteFaturado, iOrcamentosLocalizados, iRegrasFaturamentoGeral } from "./interfaces";
import serviceFaturarCliente from "./services/faturarCliente.service";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import { useEventListener } from "@vueuse/core";

useEventListener(document, "keydown", async (event) => {
    if (!state.modalSelecionarClienteOpened && !state.modalGerarBoletoOpened) {
        if (event.key === "F1") {
            if (state.dbOrcamentosClienteFaturado.length > 0) {
                actions.openModalGeralBoleto();
            }

            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === "F2") {
            state.modalSelecionarClienteOpened = true;
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === "F3") {
            state.inputLocOrcElement.focus();
            event.preventDefault();
            event.stopPropagation();
        }
    }
});

export const state = reactive({
    gridPedido: <ixGridCreate>{},
    dataLimite: null,
    modalSelecionarClienteOpened: false,
    dbClienteFaturado: <iClienteFaturado>{},
    loading: false,
    dbOrcamentosClienteFaturado: <iOrcamentosClienteFaturado[]>[],
    locValor: null,
    orcamentosLocalizados: <iOrcamentosLocalizados[]>[],
    inputLocOrcElement: <HTMLInputElement>null,
    modalGerarBoletoOpened: false,
    regrasFaturamentoGeral: <iRegrasFaturamentoGeral>{},
    setDataLimite: null,
    creditos: <iCreditoCliente[]>[],
    boletoConferido: false,
    valorConferido: 0
})

export const actions = ({
    async init() {
        actions.criarGrid()
        actions.getRegrasFaturamento()

        let dataHoje = moment()

        let dataQuinzena = moment({ year: dataHoje.year(), month: dataHoje.month(), day: 15 })
        let dataMesAnterior = dataHoje.clone().subtract(1, 'months');

        if (dataHoje.date() <= 15) {
            state.dataLimite = dataMesAnterior.endOf('months').format('YYYY-MM-DD')
        } else {
            state.dataLimite = dataQuinzena.format('YYYY-MM-DD')
        }

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

    closeModalSelecionarCliente() {
        state.modalSelecionarClienteOpened = false
    },

    async closeModalGerarBoleto(boletoGerado: boolean) {
        if (boletoGerado == true) {
            state.modalSelecionarClienteOpened = true;
            actions.resetClienteFaturado();
        }

        state.modalGerarBoletoOpened = false;
    },

    resetClienteFaturado() {
        state.dbClienteFaturado = {} as iClienteFaturado;
        state.dbOrcamentosClienteFaturado = [];
        state.orcamentosLocalizados = []
        state.creditos = []
        state.gridPedido.clear();
    },

    async selecionarCliente(cliente: iClienteFaturado) {
        actions.resetClienteFaturado();

        state.dbClienteFaturado = cliente
        state.orcamentosLocalizados = []

        await actions.buscarDadosFaturamento();
    },

    async getCreditosCliente() {
        try {

            let param: iGetCreditosClienteParam = {
                dataLimite: state.dataLimite,
                id_cliente: state.dbClienteFaturado.ID_CLIENTE
            }

            state.creditos = await serviceFaturarCliente.getCreditosCliente(param)

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar créditos do cliente!"
            })
        }
    },

    async buscarDadosFaturamento() {
        let promiseOrcamentos = actions.getOrcamentosClienteFaturado();
        let promiseCreditos = actions.getCreditosCliente();

        state.loading = true;

        await Promise.all([promiseOrcamentos, promiseCreditos])

        state.loading = false;
    },

    async getOrcamentosClienteFaturado() {
        try {
            state.loading = true

            let param: iGetOrcamentosClienteFaturadoParam = {
                dataLimite: state.dataLimite,
                id_cliente: state.dbClienteFaturado.ID_CLIENTE,
                cnpj: state.dbClienteFaturado.CGC_CLIENTE
            }

            const data = await serviceFaturarCliente.getOrcamentosClienteFaturado(param)

            state.gridPedido.source(data)
            state.dbOrcamentosClienteFaturado = data

            const mainDiv = document.querySelector('#gridOrcamentosClienteFaturado .xGridV2-content');

            const rows = mainDiv.querySelectorAll('.xGridV2-row') as any;

            rows.forEach(row => {
                let valorCompra = 0
                let valorDevolucao = 0

                const cols = row.querySelectorAll('.xGridV2-col');

                cols.forEach(col => {

                    const nameCol = col.getAttribute('name');

                    if (nameCol == 'VALOR') {
                        valorCompra += parseFloat(col.textContent.trim());
                    }

                    if (nameCol == 'DEVOLUCAO') {
                        valorDevolucao += parseFloat(col.textContent.trim());
                    }

                    if (valorDevolucao > 0) {
                        if (valorCompra == valorDevolucao) {
                            row.style.backgroundColor = '#7AB2D3';
                        }
                    }
                });
            });

            state.inputLocOrcElement.focus()

            state.setDataLimite = state.dataLimite

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os orçamentos do cliente!"
            })
        } finally {
            state.loading = false
        }
    },

    async locValorOrcamento() {
        if (!state.locValor) {
            return;
        }

        let num_orcamento = state.locValor.startsWith('+') ? state.locValor.substring(1) : state.locValor;
        let isDevolucao = state.locValor.toUpperCase().startsWith('DEV');

        if (isDevolucao) {
            let num_devolucao = state.locValor.slice(3);
            let orcamento: iOrcamentosLocalizados = state.dbOrcamentosClienteFaturado.find(
                (orc) => orc.NUM_DEVOLUCAO == num_devolucao
            );

            if (orcamento) {
                orcamento = {
                    ...orcamento,
                    ISDEVOLUCAO: true
                };
                state.orcamentosLocalizados.push(orcamento);
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Orçamento de devolução não encontrado!"
                });
            }
        } else {
            let orcamentosByNumOrcamento: iOrcamentosLocalizados[] = state.dbOrcamentosClienteFaturado.filter(
                (orc) => orc.NUM_ORCAMENTO == num_orcamento
            );

            if (orcamentosByNumOrcamento.length == 0) {
                Swal.fire({
                    icon: "warning",
                    text: "Orçamento não encontrado!"
                });
                state.locValor = null;
                return;
            }

            let orcamentosNaoAdicionados = orcamentosByNumOrcamento.filter((orc) =>
                !state.orcamentosLocalizados.some((orcLocalizado) =>
                    orcLocalizado.NUM_ORCAMENTO == orc.NUM_ORCAMENTO &&
                    orcLocalizado.DATA == orc.DATA
                )
            );

            if (orcamentosNaoAdicionados.length === 0) {
                Swal.fire({
                    icon: "warning",
                    text: "Este orçamento já foi adicionado!"
                });
                state.locValor = null;
                return;
            }

            let selectedOrcamento: iOrcamentosLocalizados;

            if (orcamentosNaoAdicionados.length === 1) {
                selectedOrcamento = orcamentosNaoAdicionados[0];
            } else {
                // Se há mais de um orçamento, exibe o diálogo para o usuário escolher
                const options = orcamentosNaoAdicionados.map((orc, index) => ({
                    text: `Orçamento ${num_orcamento} - Data: ${utils.dataBrasil(orc.DATA)}`,
                    value: index
                }));

                const { value: selectedIndex } = await Swal.fire({
                    title: 'Selecione o Orçamento',
                    input: 'select',
                    inputOptions: options.reduce((acc, option) => {
                        acc[option.value] = option.text;
                        return acc;
                    }, {}),
                    inputPlaceholder: 'Escolha uma opção',
                    showCancelButton: true
                });

                if (selectedIndex === undefined) {
                    state.locValor = null;
                    return;
                }

                selectedOrcamento = orcamentosNaoAdicionados[selectedIndex];
            }

            document.querySelectorAll('.xGridV2-col[name="NUM_ORCAMENTO"]').forEach(col => {
                if (col.textContent.trim() == num_orcamento) {
                    const parentRow = col.closest('.xGridV2-row') as HTMLBodyElement;

                    if (parentRow && parentRow.querySelector('.xGridV2-col[name="DATA"]')?.textContent?.trim() === utils.dataBrasil(selectedOrcamento.DATA)) {
                        parentRow.style.backgroundColor = '#4ade80';
                        parentRow.style.color = 'black';

                        selectedOrcamento = {
                            ...selectedOrcamento,
                            ISDEVOLUCAO: false
                        };

                        state.orcamentosLocalizados.push(selectedOrcamento);
                    }
                }
            });
        }

        state.locValor = null;
    },


    async openModalGeralBoleto() {
        if (computeds.totalValorOrcamentos.value < 20) {
            Swal.fire({
                icon: "warning",
                text: "O valor dos orçamentos é menor que R$ 20,00. Faturar não é possível!"
            })
            return
        }

        if (computeds.calcularOrcamentosLocalizados.value.total != computeds.totalValorOrcamentos.value) {
            if (await msgConfirm('Confirmação', 'Os valores dos orçamentos não batem. Deseja continuar mesmo assim?')) {
                state.boletoConferido = false;
                state.valorConferido = computeds.calcularOrcamentosLocalizados.value.total
                state.modalGerarBoletoOpened = true
                return
            }

            return
        }

        state.boletoConferido = true
        state.modalGerarBoletoOpened = true
    },


    excluirOrcLocalizado(orcamento?: iOrcamentosLocalizados) {
        if (!orcamento.NUM_ORCAMENTO) {
            state.gridPedido.source(state.dbOrcamentosClienteFaturado);
            state.orcamentosLocalizados = [];
            return;
        }

        const { NUM_ORCAMENTO, DATA } = orcamento;

        state.orcamentosLocalizados = state.orcamentosLocalizados.filter(
            orcLoc => !(orcLoc.NUM_ORCAMENTO === NUM_ORCAMENTO && orcLoc.DATA === DATA)
        );

        let columnLine = 0

        document.querySelectorAll('.xGridV2-col[name="NUM_ORCAMENTO"]').forEach(col => {
            columnLine++

            let originalBackgroundGrid = (columnLine % 2 === 0) ? '#edf2f7' : '#ffffff';
            let orifinalColorFontGrid = '#1f2937'

            if (col.textContent.trim() == NUM_ORCAMENTO.toString()) {
                const parentRow = col.closest('.xGridV2-row') as HTMLBodyElement;

                if (parentRow && parentRow.querySelector('.xGridV2-col[name="DATA"]')?.textContent?.trim() === utils.dataBrasil(DATA)) {
                    parentRow.style.backgroundColor = originalBackgroundGrid;
                    parentRow.style.color = orifinalColorFontGrid;
                }
            }
        });
    },

    async getRegrasFaturamento() {
        try {
            state.loading = true

            const data = await serviceFaturarCliente.getRegrasFaturamentoGeral()
            state.regrasFaturamentoGeral = data

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar as regras de faturamento!"
            })
        } finally {
            state.loading = false
        }
    },

    async dataLimiteEventEnter() {
        if (!state.dbClienteFaturado?.ID_CLIENTE) {
            state.modalSelecionarClienteOpened = true
            return
        }

        state.inputLocOrcElement.focus()
    },

    async dataLimiteEventFocusOut() {
        if (!state.dbClienteFaturado?.ID_CLIENTE || state.setDataLimite == state.dataLimite) {
            return
        }

        await actions.buscarDadosFaturamento();
    },
})

export const computeds = ({
    totalValorOrcamentos: computed(() => {
        const total = state.dbOrcamentosClienteFaturado.reduce(
            (total, orcamento) => total + (orcamento.VALOR - orcamento.DEVOLUCAO),
            0
        );
        return Number(total.toFixed(2));
    }),

    calcularOrcamentosLocalizados: computed(() => {
        let total = 0;
        let qtdOrcamentos = 0;

        if (state.orcamentosLocalizados.length == 0) {
            return { total, qtdOrcamentos };
        }

        state.orcamentosLocalizados.forEach(orcamento => {
            if (orcamento.ISDEVOLUCAO) {
                total = Number((total - orcamento.DEVOLUCAO).toFixed(2));
            } else {
                total = Number((total + orcamento.VALOR).toFixed(2));
                qtdOrcamentos++;
            }
        });

        return { total, qtdOrcamentos };
    })

})