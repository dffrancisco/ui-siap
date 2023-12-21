import { computed, nextTick, reactive } from "vue";
import xGrid, { ixGridCreate } from '@/plugins/xGridV2'
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import entregarReceberDetalhesService from "./services/entregarReceberDetalhes.service";
import utils, { sleep } from "@/ts/utils";
import { iCartaoDisponivel, iEntregarReceber, iMotorista, iOrcamentoBaixa, iPagamento, iTipoPagamento, iTipos } from "./interface";
import router from "@/router";
import Swal from "sweetalert2";
import { RouteLocationNormalizedLoaded } from 'vue-router'
import printJS from "print-js";
import xAuthUser from "@/plugins/xAuthUser";

export const state = reactive({
    timeAuth: 0,
    loading: false,
    loadingGrid: false,
    gridEntregarReceber: <ixGridCreate>{},
    entregarReceber: <iEntregarReceber>{},
    edtNumOrcamento: undefined,
    edtMotorista: undefined,
    edtObservacao: undefined,
    edtNumOrcamentoPendencia: undefined,
    editandoObservacao: false,
    idCliente: <number | undefined>undefined,
    motoristasComPendencia: <iMotorista[]>[],
    motoristas: <iMotorista[]>[],
    cartoesDisponiveis: <iCartaoDisponivel[]>[],
    orcamentosParaEscolher: <iOrcamentoBaixa[]>[],
    orcamentoBaixa: <iOrcamentoBaixa>{},
    modalTrocaMotorista: <iModalCreate>(<unknown>null),
    modalEscolherOrcamento: <iModalCreate>(<unknown>null),
    modalOpcoesPagamento: <iModalCreate>(<unknown>null),
    modalOpcoesPagamentoOpened: false,
})

export const horaFormatada = computed(() => {
    return state.entregarReceber?.HORA?.substring(11, 16)
})

export const motoristaAtual = computed((): iMotorista => {
    return {
        COD_FUNCIONARIO: state.entregarReceber.COD_FUNCIONARIO_MOTORISTA,
        CPF: state.entregarReceber.CPF,
        NOME_MOTORISTA: state.entregarReceber.NOME_MOTORISTA
    }
})

export const disableBotaoEditarObservacao = computed(() => {
    if (!state.entregarReceber.NUM_ORCAMENTO || state.editandoObservacao) {
        return true
    }

    return false;

})

export const disableEdtObservacao = computed(() => {
    if (state.loading) {
        return true;
    }

    if (!state.editandoObservacao) {
        return true;
    }

    if (!state.entregarReceber.NUM_ORCAMENTO) {
        return true;
    }

    return false;
})

const limparObservacao = () => {
    state.edtObservacao = '';
    state.editandoObservacao = false;
}

export const actions = {

    criarGrids() {
        state.gridEntregarReceber = new xGrid.create({
            el: '#gridEntregarReceber',
            height: '210',
            heightLine: 40,
            columns: {
                'Nº Orç.': { dataField: 'NUM_ORCAMENTO', width: '8%', center: true },
                'Data': { dataField: 'DATA', width: '10%', center: true, compare: 'dataBrasil' },
                'Cliente': { dataField: 'CLIENTE' },
                'Nome Cliente': { dataField: 'NOME_CLIENTE', width: '13%', },
                'Vendedor': { dataField: 'VENDEDOR', width: '13%' },
                'Valor': { dataField: 'VALOR', width: '8%', right: true, compare: 'valor' },
                'Tipo Pgto': { dataField: 'TIPO_PAGAMENTO', width: '8%', center: true },
                'Motorista': { dataField: 'NOME_MOTORISTA', width: '13%' },
            },
            compare: {
                dataBrasil: (r) => utils.dataBrasil(r.DATA),
                valor: (r) => utils.formatValor(r.VALOR)
            },
            query: {
                async execute(rs) {
                    state.loadingGrid = true;

                    try {
                        let data = await entregarReceberDetalhesService.getEntregarReceberPendente({
                            offset: rs.offset,
                            codFuncionario: state.edtMotorista,
                            idCliente: state.idCliente,
                            numOrcamento: state.edtNumOrcamento
                        })
                        state.gridEntregarReceber.querySourceAdd(data)
                    } finally {
                        state.loadingGrid = false;
                    }

                }
            },
            onSelectLine: (entregarReceber: iEntregarReceber) => {
                limparObservacao();
                state.entregarReceber = entregarReceber
                state.edtObservacao = entregarReceber.OBSERVACAO
            },
            onKeyDown: {
                13: (orcamento: iEntregarReceber) => {
                    state.edtNumOrcamentoPendencia = orcamento.NUM_ORCAMENTO
                    actions.validarOrcamento();
                }
            }
        })

        state.gridEntregarReceber.queryOpen({});
    },

    criarModais() {

        state.modalTrocaMotorista = new xModal.create({
            height: 300,
            width: 400,
            el: '#modalTrocaMotorista'
        })

        state.modalEscolherOrcamento = new xModal.create({
            height: 354,
            width: 750,
            el: '#modalEscolherOrcamento'
        })

        state.modalOpcoesPagamento = new xModal.create({
            height: 474,
            width: 750,
            el: '#modalOpcoesPagamento',
            onOpen: () => {
                state.modalOpcoesPagamentoOpened = true;
            },
            onClose: () => {
                state.modalOpcoesPagamentoOpened = false;
            },
        })
    },

    async getEntregarReceber() {
        state.gridEntregarReceber.queryOpen({});
    },

    async getMotoristas() {
        try {
            state.motoristas = await entregarReceberDetalhesService.getMotoristas();
            state.motoristasComPendencia = await entregarReceberDetalhesService.getMotoristasPendentes();
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar os motoristas',
                icon: "error"
            })
        }
    },

    async getCartoesDisponiveis() {
        try {
            state.cartoesDisponiveis = await entregarReceberDetalhesService.getCartoesDisponiveis();
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar os tipos de cartões',
                icon: "error"
            })
        }
    },

    init(route: RouteLocationNormalizedLoaded) {
        nextTick(async () => {
            state.loading = true;

            state.entregarReceber = {} as iEntregarReceber;

            state.edtNumOrcamentoPendencia = ""

            await actions.getMotoristas();
            await actions.getCartoesDisponiveis();

            state.edtMotorista = route?.query?.id_motorista ? parseInt(route.query.id_motorista as string) : undefined
            state.idCliente = route?.query?.id_cliente ? parseInt(route?.query?.id_cliente as string) : undefined

            actions.criarGrids()
            actions.criarModais();

            state.loading = false;
        })
    },

    onClickVoltar() {
        router.push('entregarReceber')
    },

    cancelarEscolhaOrcamento() {
        state.modalEscolherOrcamento.close()
    },

    escolherOrcamento(orcamento: iOrcamentoBaixa) {
        state.modalEscolherOrcamento.close()
        actions.validarOrcamento(orcamento.DATA);
    },

    async validarOrcamento(data: string | undefined = undefined) {

        if (!state.edtNumOrcamentoPendencia) {
            await Swal.fire({
                text: 'Informe o Nº do orçamento',
                icon: 'warning',
            })

            await sleep(500);
            //@ts-ignore
            document.querySelector('#edtNumOrcamentoPendencia').focus();
            return;
        }

        let stopTime;

        if (state.timeAuth == 0) {
            xAuthUser("Confirmação de usuário", async () => {
                state.timeAuth = 6000;

                await actions.validarOrcamentoAutenticado(data)

                stopTime = setInterval(() => {

                    state.timeAuth--

                    if (state.timeAuth == 0)
                        clearInterval(stopTime)

                }, 100);

            });

        } else {
            actions.validarOrcamentoAutenticado(data);
        }

    },

    async validarOrcamentoAutenticado(data: string | undefined = undefined) {
        state.loading = true;

        try {
            const orcamentos = await entregarReceberDetalhesService.getOrcamentosBaixa({
                numOrcamento: state.edtNumOrcamentoPendencia,
                data,
            });

            state.loading = false;


            if (orcamentos.length > 1) {
                state.orcamentosParaEscolher = orcamentos
                state.modalEscolherOrcamento.open()
            } else {
                actions.iniciarBaixa(orcamentos[0])
            }
        } catch (error) {
            state.loading = false;

            await Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao validar orçamento',
                icon: "error"
            })

            await sleep(500);
            //@ts-ignore
            document.querySelector('#edtNumOrcamentoPendencia').focus();
        } finally {
            state.loading = false
        }
    },

    async iniciarBaixa(orcamento: iOrcamentoBaixa) {
        if (orcamento.TIPO_PAGAMENTO == '6') {
            state.orcamentoBaixa = orcamento;
            state.modalOpcoesPagamento.open();
        } else {
            actions.baixarPendencia(orcamento.NUM_ORCAMENTO, orcamento.DATA);
        }
    },

    async baixarEntregarReceber(pagamentos: iPagamento[]) {
        try {
            state.loading = true;

            let tipoPagamento = '';
            let tipos = <iTipos>{};
            let valorTotalRecebido = 0;
            let pagamentoDinheiro = pagamentos.filter(pagamento => pagamento.tipoPagamento == '1');
            let pagamentosCartao = pagamentos.filter(pagamento => pagamento.tipoPagamento == '2');
            let pagamentosDeposito = pagamentos.filter(pagamento => pagamento.tipoPagamento == '8');
            let pagamentosPix = pagamentos.filter(pagamento => pagamento.tipoPagamento == 'P');

            pagamentos.forEach(pagamento => {
                tipoPagamento += pagamento.tipoPagamento
                valorTotalRecebido += pagamento.valor;
            })

            if (pagamentoDinheiro.length > 0) {
                tipos[1] = {
                    valor: pagamentoDinheiro[0].valor
                }
            }

            if (pagamentosCartao.length > 0) {
                tipos[2] = {
                    valor: 0,
                    cartoes: []
                }

                pagamentosCartao.forEach(cartao => {
                    tipos[2].valor += cartao.valor
                    tipos[2].cartoes.push({
                        codBandeira: cartao.codigoBandeiraCartao.toString(),
                        divide: cartao.divisaoCartao,
                        numCartaoAut: cartao.autorizacao,
                        tipo: cartao.tipoCartao,
                        valor: cartao.valor
                    })
                })
            }

            if (pagamentosDeposito.length > 0) {
                tipos[8] = {
                    valor: 0,
                    depositos: []
                }

                pagamentosDeposito.forEach(deposito => {
                    tipos[8].valor += deposito.valor
                    tipos[8].depositos.push({
                        valor: deposito.valor,
                        controle: deposito.autorizacao,
                        autorizado: '-',
                    })
                })
            }

            if (pagamentosPix.length > 0) {
                tipos['P'] = {
                    valor: 0,
                    pix: []
                }

                pagamentosPix.forEach(pix => {
                    tipos['P'].valor += pix.valor
                    tipos['P'].pix.push({
                        valor: pix.valor,
                        controle: pix.autorizacao,
                        autorizado: '-',
                    })
                })
            }

            await entregarReceberDetalhesService.baixarEntregarReceber({
                data: state.orcamentoBaixa.DATA,
                numOrcamento: state.orcamentoBaixa.NUM_ORCAMENTO,
                tipoPagamento: tipoPagamento as iTipoPagamento,
                pagamento: {
                    tipoPagamento: tipoPagamento,
                    valorRecebido: valorTotalRecebido,
                    tipos
                }
            })

            state.modalOpcoesPagamento.close();

            await actions.getEntregarReceber();

            state.edtNumOrcamentoPendencia = ''

            //@ts-ignore
            document.querySelector('#edtNumOrcamentoPendencia').focus();

        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao baixar entregar e receber',
                icon: "error"
            })
        } finally {
            state.loading = false;
        }
    },

    fecharModalPagamento() {
        state.modalOpcoesPagamento.close();
    },

    async baixarPendencia(numOrcamento: number, data: string) {
        try {
            state.loading = true;

            await entregarReceberDetalhesService.baixarPendencia({
                numOrcamento,
                data
            })

            state.edtNumOrcamentoPendencia = ''

            //@ts-ignore
            document.querySelector('#edtNumOrcamentoPendencia').focus();

            await actions.getEntregarReceber();
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao remover pendência',
                icon: "error"
            })
        } finally {
            state.loading = false
        }
    },

    async onClickImprimir() {
        const entregarReceberImpressao = state.gridEntregarReceber.data() as unknown as iEntregarReceber[];

        entregarReceberImpressao.forEach(entregarReceber => {
            entregarReceber.DATA = utils.dataBrasil(entregarReceber.DATA)
            //@ts-ignore
            entregarReceber.VALOR = utils.formatValor(entregarReceber.VALOR)
            entregarReceber.NOME_MOTORISTA = entregarReceber.NOME_MOTORISTA || '-'
        })

        printJS({
            documentTitle: 'Entregar e Receber / Pendências',
            printable: state.gridEntregarReceber.data(),
            properties: [
                { field: 'NUM_ORCAMENTO', displayName: 'Nº Orç.' },
                { field: 'DATA', displayName: 'Data' },
                { field: 'CLIENTE', displayName: 'Cliente' },
                { field: 'NOME_CLIENTE', displayName: 'Nome Cliente' },
                { field: 'VENDEDOR', displayName: 'Vendedor' },
                { field: 'VALOR', displayName: 'Valor' },
                { field: 'TIPO_PAGAMENTO', displayName: 'Tipo Pgto' },
                { field: 'NOME_MOTORISTA', displayName: 'Motorista' },
            ],
            type: 'json'
        })
    },

    async onClickEditarObservacao() {
        state.editandoObservacao = true;
        state.gridEntregarReceber.disable();
        await sleep(200)

        //@ts-ignore
        document.querySelector('#edtObservacao').focus();
    },

    async onClickSalvarObservacao() {
        state.loading = true
        try {

            if (state.entregarReceber.TIPO_PAGAMENTO == '6') {
                await entregarReceberDetalhesService.insertUpdateObsEntregarReceber({
                    numOrcamento: state.entregarReceber.NUM_ORCAMENTO,
                    data: state.entregarReceber.DATA,
                    obs: state.edtObservacao
                })
            } else {
                await entregarReceberDetalhesService.updateDescPendenciaMotorista({
                    numOrcamento: state.entregarReceber.NUM_ORCAMENTO,
                    data: state.entregarReceber.DATA,
                    descPendencia: state.edtObservacao
                })
            }

            await actions.getEntregarReceber();

        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao alterar observação',
                icon: "error"
            })
        } finally {
            state.loading = false;
            state.editandoObservacao = false;
            state.gridEntregarReceber.enable();
        }

    },

    onClickTrocarMotorista() {
        state.modalTrocaMotorista.open();
    },

    async trocarMotorista(motorista: iMotorista) {
        try {
            state.loading = true;
            await entregarReceberDetalhesService.trocarMotorista({
                codFuncionario: motorista.COD_FUNCIONARIO,
                numOrcamento: state.entregarReceber.NUM_ORCAMENTO,
                data: state.entregarReceber.DATA
            })

            state.modalTrocaMotorista.close()

            await actions.getEntregarReceber()

            Swal.fire({
                text: 'Motorista alterado com sucesso',
                icon: 'success'
            })
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao trocar o motorista',
                icon: "error"
            })
        } finally {
            state.loading = false;
        }
    }

}

export default {
    state,
    actions,
}