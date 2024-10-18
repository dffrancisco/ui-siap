import { reactive } from "vue";
import { iClientes, iComprasFaturadas, iOrcamento, iOrcamentosEmAndamento, iParamRequisicoes, iResponseDadosCliente, iTabs, iTodosItens } from "./interfaces";
import moment from "moment";
import serviceConsultaCliente from "./services/consultaCliente.service"
import Swal from "sweetalert2";
import utils from "@/ts/utils";

export const state = reactive({
    loading: false,
    modalLocalizarClienteOpened: false,
    dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().format("YYYY-MM-DD"),
    tab: <iTabs>{},
    clienteSelecionado: <iClientes>{},
    cliente: "",
    telefone: "",
    cnpj: "",
    observacao: "",
    idCliente: 0,
    limiteDisponivelDashboard: 0,
    creditoUsadoDashboard: 0,
    limiteCreditoDashboard: 0,
    ticketMedioDashboard: 0,
    boletosEmAbertoDashboard: 0,
    boletosAtrasadosDashboard: 0,
    boletosEmDiaDashboard: 0,
    todosBoletosDashboard: 0,
    qtdOrcamentosDashboard: 0,
    devolucoesDashboard: 0,
    vendedorDashboard: "",
    marcaDashboard: "",
    tableOrcamentos: <iOrcamento[]>[],
    headersOrcamentos: <any>[
        {
            title: "Nº Orç.",
            key: "NUM_ORCAMENTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Data",
            key: "DATA",
            sortable: true,
            align: 'left',
            value: (item: any) => utils.dataBrasil(item.DATA)
        },
        {
            title: "Nome Cliente",
            key: "NOME_CLIENTE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Vendedor",
            key: "LOGIN",
            sortable: true,
            align: 'left',
        },
        {
            title: "Montagem",
            key: "VALOR_MONTAGEN",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.VALOR_MONTAGEN)
        },
        {
            title: "Desconto",
            key: "DESCONTO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.DESCONTO)
        },
        {
            title: "Valor",
            key: "VALOR",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.VALOR)
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
    tableOrcamentosNaoFinalizados: <iOrcamentosEmAndamento[]>[],
    headersOrcamentosNaoFinalizados: <any>[
        {
            title: "Nº Orç.",
            key: "NUM_ORCAMENTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Data",
            key: "DATA",
            sortable: true,
            align: 'left',
            value: (item: any) => utils.dataBrasil(item.DATA)
        },
        {
            title: "Nome Cliente",
            key: "NOME_CLIENTE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Estoquista",
            key: "LOGIN",
            sortable: true,
            align: 'left',
        },
        {
            title: "Desconto",
            key: "DESCONTO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.DESCONTO)
        },
        {
            title: "Valor",
            key: "VALOR",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.VALOR)
        },
    ],
    tableTodosItensOrcamentos: <iTodosItens[]>[],
    headersTodosItensOrcamentos: <any>[
        {
            title: "Quantidade",
            key: "QUANTIDADE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Nº Fabricante",
            key: "NUM_FABRICANTE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Descrição itens",
            key: "DESC_PRODUTO",
            sortable: true,
            align: 'left',
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
    tableComprasFaturadas: <iComprasFaturadas[]>[],
    headersComprasFaturadas: <any>[
        {
            title: "Nº Orç.",
            key: "NUM_ORCAMENTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Data",
            key: "DATA",
            sortable: true,
            align: 'left',
            value: (item: any) => utils.dataBrasil(item.DATA)
        },
        {
            title: "Vendedor",
            key: "VENDEDOR",
            sortable: true,
            align: 'left',
        },
        {
            title: "Valor",
            key: "VALOR",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.VALOR)
        },
        {
            title: "Desc.",
            key: "DESCONTO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.DESCONTO)
        },
        {
            title: "Dev.",
            key: "DEVOLUCAO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.DEVOLUCAO)
        },
        {
            title: "Mont.",
            key: "VALOR_MONTAGEN",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.VALOR_MONTAGEN)
        },
        {
            title: "Cliente",
            key: "NOME_CLIENTE",
            sortable: true,
            align: 'left',
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
})

export const actions = {

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    closeModalLocalizarCliente() {
        state.modalLocalizarClienteOpened = false;
    },

    selecionarCliente(clienteSelecionado: iClientes, dataInicio, dataFim) {
        state.clienteSelecionado = clienteSelecionado;
        actions.popularInputs(clienteSelecionado, dataInicio, dataFim)
    },

    popularInputs(clienteSelecionado, dataInicio, dataFim) {
        state.dataInicio = dataInicio;
        state.dataFim = dataFim;
        state.cliente = clienteSelecionado.NOME
        state.telefone = clienteSelecionado.TELEFONE1
        state.cnpj = clienteSelecionado.CGC_CLIENTE
        state.observacao = clienteSelecionado.OBS
        state.idCliente = clienteSelecionado.ID_CLIENTE

        actions.requisicoesCliente()
    },

    async requisicoesCliente() {
        try {
            state.loading = true;
            let param: iParamRequisicoes = {
                idCliente: state.idCliente,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                cnpj: state.cnpj
            }

            const dadosCliente = await serviceConsultaCliente.requisicoesDadosCliente(param);
            actions.popularDashboard(dadosCliente);
        } catch (error) {
            const errorMessage = error.response?.data?.msg || "Erro ao buscar os dados.";
            Swal.fire({
                icon: "error",
                text: errorMessage
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    popularDashboard(dadosCliente: iResponseDadosCliente) {
        state.loading = true

        state.limiteDisponivelDashboard = state.clienteSelecionado.LIMITE_CREDITO - state.clienteSelecionado.CREDITO_USADO;
        state.creditoUsadoDashboard = state.clienteSelecionado.CREDITO_USADO;
        state.limiteCreditoDashboard = state.clienteSelecionado.LIMITE_CREDITO;
        state.ticketMedioDashboard = dadosCliente.ticketMedioDashboard[0].TICKET_MEDIO;
        state.boletosEmAbertoDashboard = dadosCliente.boletosDashboard[0].BOLETOSABERTOS;
        state.boletosAtrasadosDashboard = dadosCliente.boletosDashboard[0].BOLETOSATRASADOS;
        state.boletosEmDiaDashboard = dadosCliente.boletosDashboard[0].BOLETOSEMDIA;
        state.todosBoletosDashboard = dadosCliente.boletosDashboard[0].TOTALBOLETOS;
        state.qtdOrcamentosDashboard = dadosCliente.ticketMedioDashboard[0].ORCAMENTOS;
        state.devolucoesDashboard = dadosCliente.devolucoesDashboard[0].DEVOLUCOES
        state.vendedorDashboard = dadosCliente.devolucoesDashboard[0].LOGIN
        state.marcaDashboard = dadosCliente.marcaDashboard[0].DESCRICAO
        state.tableOrcamentos = dadosCliente.orcamentos
        state.tableOrcamentosNaoFinalizados = dadosCliente.orcamentosEmAndamento
        state.tableTodosItensOrcamentos = dadosCliente.todosItens
        state.tableComprasFaturadas = dadosCliente.comprasFaturadas

        state.loading = false;
    },

    openModalDetalhesOrcamento(item) {
        console.log(item);
    },

    openModalDetalhesItemOrcamento(item) {
        console.log(item);
    }
}