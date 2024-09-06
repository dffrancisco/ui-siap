import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { reactive } from "vue";
import { iCliente, iParamDetalhesCliente, iTabs } from "./interfaces";
import Swal from "sweetalert2";
import serviceLiberarCliente from "./services/liberarCliente.service"

export const state = reactive({
    loading: false,
    modalLiberarCliente: <iModalCreate>{},
    modalLiberarClienteOpened: false,
    idCliente: 0 || null,
    tab: <iTabs>{},
    gridLiberacoes: <ixGridCreate>{},
    gridBloqueiosDesbloqueios: <ixGridCreate>{},
    gridCompras: <ixGridCreate>{},
    gridBoletos: <ixGridCreate>{}
})

export const actions = {

    init() {
        actions.criarModal()
        actions.gridLiberacoes()
        actions.gridBloqueiosDesbloqueios()
        actions.gridBoletos()
        actions.gridCompras()
    },

    criarModal() {
        state.modalLiberarCliente = new xModal.create({
            el: "#modalLiberarCliente",
            height: 500,
            width: 720,
            theme: 'xModal-blue',
            onOpen: () => { state.modalLiberarClienteOpened = true },
            onClose: () => { state.modalLiberarClienteOpened = false }
        })
    },

    modalLiberarClienteClose() {
        state.modalLiberarCliente.close();
    },

    openModalLiberarCliente() {
        state.modalLiberarCliente.open();
    },

    async selecionarCliente(cliente: iCliente) {

        state.idCliente = cliente.ID_CLIENTE
        // let param = state.idCliente

        state.gridLiberacoes.queryOpen({
            ID_CLIENTE: cliente.ID_CLIENTE,
        })

        state.gridBloqueiosDesbloqueios.queryOpen({
            ID_CLIENTE: cliente.ID_CLIENTE,
        })

        state.gridBoletos.queryOpen({
            ID_CLIENTE: cliente.ID_CLIENTE,
        })

        state.gridCompras.queryOpen({
            ID_CLIENTE: cliente.ID_CLIENTE,
        })

        actions.modalLiberarClienteClose()
    },

    gridLiberacoes() {
        //primeiro grid da primeira tab
        state.gridLiberacoes = new xGridV2.create({
            el: "#gridLiberacoes",
            height: 250,
            count: true,
            columns: {
                DATA: { dataField: "DATA" },
                FATURADO: { dataField: "FATURADO" },
                HORA: { dataField: "HORA" },
                LIMITE_ATUAL: { dataField: "LIMITE_ATUAL" },
                NOVO_LIMITE: { dataField: "NOVO_LIMITE" },
                LOGIN: { dataField: "LOGIN" }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getLiberacoes({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridLiberacoes.querySourceAdd(data as any);
                }
            }
        })


    },

    gridBloqueiosDesbloqueios() {

        state.gridBloqueiosDesbloqueios = new xGridV2.create({
            el: "#gridBloqueiosDesbloqueios",
            height: 250,
            count: true,
            columns: {
                DATA_BLOQUEIO: { dataField: "DATA_BLOQUEIO" },
                DATA_DESBLOQUEIO: { dataField: "DATA_DESBLOQUEIO" },
                BLOQUEADOR: { dataField: "BLOQUEADOR" },
                LIBERADOR: { dataField: "LIBERADOR" },
                OBS: { dataField: "OBS" }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getBloqueiosDesbloqueios({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridBloqueiosDesbloqueios.querySourceAdd(data as any);
                },
            },
        });
    },

    gridCompras() {
        state.gridCompras = new xGridV2.create({
            el: "#gridCompras",
            height: 250,
            count: true,
            columns: {
                BOLETO: { dataField: "BOLETO" },
                CAIXA: { dataField: "CAIXA" },
                DATA: { dataField: "DATA" },
                DESCONTO: { dataField: "DESCONTO" },
                DEVOLUCAO: { dataField: "DEVOLUCAO" },
                HORA: { dataField: "HORA" },
                NOME_CLIENTE: { dataField: "NOME_CLIENTE" },
                NUM_ORCAMENTO: { dataField: "NUM_ORCAMENTO" },
                TIPO_PAGAMENTO: { dataField: "TIPO_PAGAMENTO" },
                VALOR: { dataField: "VALOR" },
                VALOR_MONTAGEM: { dataField: "VALOR_MONTAGEM" },
                VENDEDOR: { dataField: "VENDEDOR" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getCompras({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridCompras.querySourceAdd(data as any);
                },
            },
        });
    },

    gridBoletos() {

        state.gridBoletos = new xGridV2.create({
            el: "#gridBoletos",
            height: 250,
            count: true,
            columns: {
                DATA_PROCESSAMENTO: { dataField: "DATA_PROCESSAMENTO" },
                DATA_QUITACAO: { dataField: "DATA_QUITACAO" },
                DATA_VENCIMENTO: { dataField: "DATA_VENCIMENTO" },
                NUM_BOLETO: { dataField: "NUM_BOLETO" },
                PARCELA: { dataField: "PARCELA" },
                VALOR: { dataField: "VALOR" },
                VALOR_QUITACAO: { dataField: "VALOR_QUITACAO" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getBoletos({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridBoletos.querySourceAdd(data as any);
                },
            },
        });
    },

    async getLiberacoes({ offset, param }: iParamDetalhesCliente) {
        try {
            state.loading = true
            const data = await serviceLiberarCliente.getLiberacoes({ offset, param })

            return data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao buscar os dados do cliente",
            });
        } finally {
            state.loading = false
        }
    },

    async getBloqueiosDesbloqueios({ offset, param }: iParamDetalhesCliente) {
        try {
            state.loading = true
            const data = await serviceLiberarCliente.getBloqueiosDesbloqueios({ offset, param })

            return data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao buscar os dados do cliente",
            });
        } finally {
            state.loading = false
        }
    },

    async getCompras({ offset, param }: iParamDetalhesCliente) {
        try {
            state.loading = true
            const data = await serviceLiberarCliente.getCompras({ offset, param })

            return data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao buscar os dados do cliente",
            });
        } finally {
            state.loading = false
        }
    },

    async getBoletos({ offset, param }: iParamDetalhesCliente) {
        try {
            state.loading = true
            const data = await serviceLiberarCliente.getBoletos({ offset, param })

            return data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao buscar os dados do cliente",
            });
        } finally {
            state.loading = false
        }
    },

}