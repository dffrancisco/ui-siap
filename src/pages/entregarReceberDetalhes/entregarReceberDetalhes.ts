import { computed, nextTick, reactive } from "vue";
import xGrid, { ixGridCreate } from '@/plugins/xGridV2'
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import entregarReceberDetalhesService from "./services/entregarReceberDetalhes.service";
import utils, { sleep } from "@/ts/utils";
import { iEntregarReceber, iMotorista } from "./interface";
import router from "@/router";
import Swal from "sweetalert2";
import { RouteLocationNormalizedLoaded } from 'vue-router'

export const state = reactive({
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
    modalTrocaMotorista: <iModalCreate>(<unknown>null)
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

    init(route: RouteLocationNormalizedLoaded) {
        nextTick(async () => {
            state.loading = true;

            state.entregarReceber = {} as iEntregarReceber;

            await actions.getMotoristas();

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