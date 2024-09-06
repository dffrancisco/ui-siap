import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { reactive } from "vue";
import { iCliente, iParamDetalhesCliente, iTabs } from "./interfaces";
import Swal from "sweetalert2";
import serviceLiberarCliente from "./services/liberarCliente.service"
import utils from "@/ts/utils";
import moment from "moment";

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
                Data: { dataField: "DATA", width: "15%", render: utils.dataBrasil, center: true },
                Hora: { dataField: "HORA", width: "15%", render: utils.formatHora, center: true },
                Tipo: { dataField: "FATURADO", center: true, width: "15%" },
                'Limite Atual': { dataField: "LIMITE_ATUAL", render: utils.formatValor, center: true },
                'Limite Novo': { dataField: "NOVO_LIMITE", render: utils.formatValor, center: true },
                Funcionário: { dataField: "LOGIN" }
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
                'Data Bloqueio': { dataField: "DATA_BLOQUEIO", width: "10%", render: utils.dataBrasil, center: true },
                'Data Desbloqueio': { dataField: "DATA_DESBLOQUEIO", width: "11%", render: utils.dataBrasil, center: true },
                Observação: { dataField: "OBS" },
                Bloqueador: { dataField: "BLOQUEADOR", width: "10%", compare: "formatNomeBloqueador" },
                Liberador: { dataField: "LIBERADOR", width: "10%", compare: "formatNomeLiberador" },
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
            compare: {
                formatNomeBloqueador: (r) => {
                    if (r.BLOQUEADOR) {
                        const nome = r.BLOQUEADOR
                        const primeiroNome = nome.split(' ')[0];
                        return primeiroNome;
                    }
                },
                formatNomeLiberador: (r) => {
                    if (r.LIBERADOR) {
                        const nome = r.LIBERADOR
                        const primeiroNome = nome.split(' ')[0];
                        return primeiroNome;
                    }
                }
            },
        });
    },

    gridCompras() {
        state.gridCompras = new xGridV2.create({
            el: "#gridCompras",
            height: 250,
            count: true,
            columns: {
                'Nº Orç': { dataField: "NUM_ORCAMENTO", width: "8%" },
                Data: { dataField: "DATA", render: utils.dataBrasil },
                Hora: { dataField: "HORA", render: utils.formatHora, width: "10%" },
                Caixa: { dataField: "CAIXA", compare: "formatNome" },
                Vendedor: { dataField: "VENDEDOR", compare: "formatVendedor" },
                'Tipo Pg.': { dataField: "TIPO_PAGAMENTO", width: "5%", center: true },
                Valor: { dataField: "VALOR", render: utils.formatValor, right: true },
                Desconto: { dataField: "DESCONTO", render: utils.formatValor, right: true },
                Devolução: { dataField: "DEVOLUCAO", render: utils.formatValor, right: true },
                Montagem: { dataField: "VALOR_MONTAGEM", render: utils.formatValor, right: true },
                Nome: { dataField: "NOME_CLIENTE" },
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
            compare: {
                formatNome: (r) => {
                    if (r.CAIXA) {
                        const nome = r.CAIXA
                        const primeiroNome = nome.split(' ')[0];
                        return primeiroNome;
                    }
                },
                formatVendedor: (r) => {
                    if (r.VENDEDOR) {
                        const nome = r.VENDEDOR
                        const primeiroNome = nome.split(' ')[0];
                        return primeiroNome;
                    }
                }
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