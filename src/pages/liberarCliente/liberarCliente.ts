import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { reactive } from "vue";
import { iCliente, iParamDetalhesCliente, iParamUpdateCliente, iTabs } from "./interfaces";
import Swal from "sweetalert2";
import serviceLiberarCliente from "./services/liberarCliente.service"
import utils, { msgConfirmSemCodigo } from "@/ts/utils";

export const state = reactive({
    loading: false,
    modalLiberarCliente: <iModalCreate>{},
    modalLiberarClienteOpened: false,
    idCliente: 0 || null,
    nomeClienteSelect: "",
    cnpjSelect: "",
    creditoUsado: "",
    creditoLimite: "",
    creditoLimiteAtual: "",
    tipoCompra: "",
    tipoFaturamento: "",
    dividirBoleto: "",
    diaVencimento: 0 || null,
    status: "",
    statusColor: "",
    tab: <iTabs>{},
    gridLiberacoes: <ixGridCreate>{},
    gridBloqueiosDesbloqueios: <ixGridCreate>{},
    gridCompras: <ixGridCreate>{},
    gridBoletos: <ixGridCreate>{},
    botaoAlterarHabilitado: true,
    botaoSalvarHabilitado: false,
    botaoCancelarHabilitado: false,
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

    validarDiaVencimento(value: any) {
        const dia = parseInt(value, 10);
        if (!value) return true;
        if (dia >= 1 && dia <= 31) {
            return true; // Dia válido
        } else {
            Swal.fire({
                icon: "warning",
                title: "O dia deve estar entre 1 e 31!",
                timer: 2000
            });
            return;
        }
    },

    modalLiberarClienteClose() {
        state.modalLiberarCliente.close();
    },

    openModalLiberarCliente() {
        if (state.botaoSalvarHabilitado == true) {
            Swal.fire({
                icon: "warning",
                title: "Alteração em andamento, salve ou cancele para selecionar outro cliente!",
                timer: 2000
            });
            const inputCreditoLimite = document.querySelector("#creditoLimite") as HTMLElement;
            inputCreditoLimite.focus();
            return
        }

        state.modalLiberarCliente.open();
    },

    async selecionarCliente(cliente: iCliente) {
        actions.popularInputs(cliente)
        actions.popularGrids(cliente)
        actions.cancelar()
    },

    popularInputs(cliente) {
        state.idCliente = cliente.ID_CLIENTE
        state.nomeClienteSelect = cliente.CLIENTE
        state.cnpjSelect = cliente.CNPJ
        state.creditoUsado = utils.formatValor(cliente.CREDITO_USADO)
        state.creditoLimite = utils.formatValor(cliente.LIMITE_CREDITO)
        state.creditoLimiteAtual = cliente.LIMITE_CREDITO
        state.tipoCompra = cliente.FATURADO == "0" ? "Não Faturado" : "Faturado"
        state.tipoFaturamento = cliente.TIPO_FATURAMENTO ? cliente.TIPO_FATURAMENTO == "Q" ? "Quinzenal" : "Mensal" : "";
        state.dividirBoleto = cliente.DIVIDIR_BOLETO ? cliente.DIVIDIR_BOLETO == "S" ? "Sim" : "Não" : "";
        state.diaVencimento = cliente.DIA_VENCIMENTO_BOLETO
        state.status = cliente.BLOQUEADO == 0 ? "Liberado" : "Bloqueado"
        state.statusColor = cliente.BLOQUEADO == 0 ? "green" : "red";
    },

    popularGrids(cliente) {
        state.loading = true
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
        state.loading = false
        actions.modalLiberarClienteClose()
    },

    gridLiberacoes() {
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
            },
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
                'Nº Boleto': { dataField: "NUM_BOLETO", right: true },
                Parcela: { dataField: "PARCELA", center: true },
                Processamento: { dataField: "DATA_PROCESSAMENTO", render: utils.dataBrasil, center: true },
                Vencimento: { dataField: "DATA_VENCIMENTO", render: utils.dataBrasil, center: true },
                Quitação: { dataField: "DATA_QUITACAO", render: utils.dataBrasil, center: true },
                Valor: { dataField: "VALOR", render: utils.formatValor, right: true },
                'Valor Pago': { dataField: "VALOR_QUITACAO", render: utils.formatValor, right: true },
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

    alterar() {
        state.botaoAlterarHabilitado = false;
        state.botaoSalvarHabilitado = true;
        state.botaoCancelarHabilitado = true;

        if (!state.idCliente) {
            actions.cancelar()
            Swal.fire({
                icon: "warning",
                title: "Selecione um cliente primeiro",
            });
            actions.openModalLiberarCliente()
            return
        }

        const inputCreditoLimite = document.querySelector("#creditoLimite") as HTMLElement;
        inputCreditoLimite.focus();
    },

    salvar() {
        state.botaoAlterarHabilitado = true;
        state.botaoSalvarHabilitado = false;
        state.botaoCancelarHabilitado = false;

        actions.updateCliente()
    },

    cancelar() {
        state.botaoAlterarHabilitado = true;
        state.botaoSalvarHabilitado = false;
        state.botaoCancelarHabilitado = false;
    },

    async updateCliente() {
        let param = {
            idCliente: state.idCliente,
            tipoCompra: state.tipoCompra === "Faturado" ? 1 : 0,
            creditoLimiteAtual: state.creditoLimiteAtual,
            creditoLimiteNovo: parseFloat(state.creditoLimite.replace(/\./g, '').replace(',', '.')),
            tipoFaturamento: state.tipoFaturamento === "Quinzenal" ? "Q" : "M",
            divideBoleto: state.dividirBoleto === "Sim" ? "S" : "N",
            diaVencimento: state.diaVencimento
        }

        if (await msgConfirmSemCodigo("Confirmação", "Deseja alterar os dados do cliente?")) {

            try {
                state.loading = true
                const data = await serviceLiberarCliente.updateCliente(param as iParamUpdateCliente)

                state.gridLiberacoes.queryOpen({
                    ID_CLIENTE: state.idCliente,
                })

                return data
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Erro ao alterar os dados do cliente",
                });
            } finally {
                state.loading = false
            }
        }
    }

}