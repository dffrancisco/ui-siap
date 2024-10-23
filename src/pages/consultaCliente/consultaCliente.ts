import { computed, reactive } from "vue";
import {
    iBoletosAbertos, iBoletosAtrasados, iBoletosComprasFaturadas, iBoletosEmDia, iClientes, iComprasFaturadas,
    iCreditoDevolucao, iDetalhesItensCredito, iDetalhesItensMarca, iDetalhesItensOrc, iDetalhesItensOrcamento, iDetalhesMontagemOrc,
    iDetalhesUsoCredito,
    iDevolucao, iMarca, iOrcamento, iOrcamentosEmAndamento, iParamComprasFaturadas, iParamDetalhesCredito, iParamDetalhesItensOrc,
    iParamDetalhesOrc, iParamItensMarca, iParamRequisicoes, iResponseDadosCliente, iTodosBoletos, iTodosItens,
    iVendaPorVendedor, iVendasPorAno
} from "./interfaces";
import moment from "moment";
import serviceConsultaCliente from "./services/consultaCliente.service"
import Swal from "sweetalert2";
import utils from "@/ts/utils";

export const state = reactive({
    menuItems: [
        { title: "Dashboard", value: "dashboard" },
        { title: "Orçamentos", value: "orcamentos" },
        { title: "Orç. Não Finalizados", value: "orcamentosNaoFinalizados" },
        { title: "Todos Itens", value: "todosItens" },
        { title: "Compras Faturadas", value: "comprasFaturadas" },
        { title: "Marca", value: "marca" },
        { title: "Crédito de Devolução", value: "creditoDevolucao" },
        { title: "Devolução", value: "devolucao" },
        { title: "Venda por Vendedor", value: "vendaPorVendedor" },
        { title: "Vendas por Ano", value: "vendasPorAno" },
    ],
    loading: false,
    modalLocalizarClienteOpened: false,
    modalBoletosEmAbertoOpened: false,
    modalBoletosAtrasadosOpened: false,
    modalBoletosEmDiaOpened: false,
    modalTodosBoletosOpened: false,
    modalDetalhesOrcamentoOpened: false,
    modalDetalhesItensOrcamentoOpened: false,
    modalDetalhesComprasFaturadasOpened: false,
    modalDetalhesItensMarcaOpened: false,
    modalDetalhesCreditoOpened: false,
    boletosEmAberto: <iBoletosAbertos[]>[],
    boletosAtrasados: <iBoletosAtrasados[]>[],
    boletosEmDia: <iBoletosEmDia[]>[],
    todosBoletos: <iTodosBoletos[]>[],
    dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().format("YYYY-MM-DD"),
    tab: "dashboard",
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
    tableMarcas: <iMarca[]>[],
    headersMarcas: <any>[
        {
            title: "Quantidade",
            key: "QUANTIDADE",
            sortable: true,
            align: 'center',
        },
        {
            title: "Marca",
            key: "DESCRICAO",
            sortable: true,
            align: 'left'
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
    tableCreditoDevolucao: <iCreditoDevolucao[]>[],
    headersCreditoDevolucao: <any>[
        {
            title: "Nº Orçamento",
            key: "NUM_ORCAMENTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Valor",
            key: "VALOR",
            sortable: true,
            align: 'left',
            value: (item: any) => utils.formatValor(item.VALOR)
        },
        {
            title: "Data do Crédito",
            key: "DATA_CREDITO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.dataBrasil(item.DATA_CREDITO)
        },
        {
            title: "Data do Uso",
            key: "DATA_DO_USO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.dataBrasil(item.DATA_DO_USO)
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
    tableDevolucao: <iDevolucao[]>[],
    headersDevolucao: <any>[
        {
            title: "Nº Orçamento",
            key: "NUM_ORCAMENTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Nº Devolução",
            key: "ID_DEVOLUCAO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Data Devolução",
            key: "DATA",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.dataBrasil(item.DATA)
        },
        {
            title: "Data Venda",
            key: "DATA_VENDA",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.dataBrasil(item.DATA_VENDA)
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
    graficoVendaPorVendedor: <iVendaPorVendedor[]>[],
    graficoVendasPorAno: <iVendasPorAno[]>[],
    itensOrcamento: <iDetalhesItensOrc[]>[],
    montagemOrcamento: <iDetalhesMontagemOrc[]>[],
    detalhesItensOrcamento: <iDetalhesItensOrcamento[]>[],
    detalhesComprasFaturadas: <iBoletosComprasFaturadas[]>[],
    detalhesItensMarca: <iDetalhesItensMarca[]>[],
    detalhesUsoCredito: <iDetalhesUsoCredito[]>[],
    detalhesItensCredito: <iDetalhesItensCredito[]>[],
})

export const actions = {

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
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
            actions.popularDashboardETabelas(dadosCliente);
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

    popularDashboardETabelas(dadosCliente: iResponseDadosCliente) {
        state.loading = true

        state.limiteDisponivelDashboard = state.clienteSelecionado.LIMITE_CREDITO - state.clienteSelecionado.CREDITO_USADO;
        state.creditoUsadoDashboard = state.clienteSelecionado.CREDITO_USADO;
        state.limiteCreditoDashboard = state.clienteSelecionado.LIMITE_CREDITO;
        state.ticketMedioDashboard = dadosCliente.ticketMedioDashboard[0]?.TICKET_MEDIO;
        state.boletosEmAbertoDashboard = dadosCliente.boletosDashboard[0]?.BOLETOSABERTOS;
        state.boletosAtrasadosDashboard = dadosCliente.boletosDashboard[0]?.BOLETOSATRASADOS;
        state.boletosEmDiaDashboard = dadosCliente.boletosDashboard[0]?.BOLETOSEMDIA;
        state.todosBoletosDashboard = dadosCliente.boletosDashboard[0]?.TOTALBOLETOS;
        state.qtdOrcamentosDashboard = dadosCliente.ticketMedioDashboard[0]?.ORCAMENTOS;
        state.devolucoesDashboard = dadosCliente.devolucoesDashboard[0]?.DEVOLUCOES
        state.vendedorDashboard = dadosCliente.devolucoesDashboard[0]?.LOGIN
        state.marcaDashboard = dadosCliente.marcaDashboard[0]?.DESCRICAO
        state.tableOrcamentos = dadosCliente.orcamentos
        state.tableOrcamentosNaoFinalizados = dadosCliente.orcamentosEmAndamento
        state.tableTodosItensOrcamentos = dadosCliente.todosItens
        state.tableComprasFaturadas = dadosCliente.comprasFaturadas
        state.tableMarcas = dadosCliente.marca
        state.tableCreditoDevolucao = dadosCliente.creditoDevolucao
        state.tableDevolucao = dadosCliente.devolucao
        state.graficoVendaPorVendedor = dadosCliente.vendaPorVendedor
        state.graficoVendasPorAno = dadosCliente.vendasPorAno

        state.loading = false;
    },

    async openModalBoletosAbertos() {
        try {
            state.loading = true;
            const boletosEmAberto = await serviceConsultaCliente.getBoletosEmAberto(state.idCliente);

            state.boletosEmAberto = boletosEmAberto
            state.modalBoletosEmAbertoOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os boletos em aberto."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalBoletosAtrasados() {
        try {
            state.loading = true;
            const boletosAtrasados = await serviceConsultaCliente.getBoletosAtrasados(state.idCliente);

            state.boletosAtrasados = boletosAtrasados
            state.modalBoletosAtrasadosOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os boletos em atraso."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalBoletosEmDia() {
        try {
            state.loading = true;
            const boletosEmDia = await serviceConsultaCliente.getBoletosEmDia(state.idCliente);

            state.boletosEmDia = boletosEmDia
            state.modalBoletosEmDiaOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os boletos."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalTodosBoletos() {
        try {
            state.loading = true;
            const todosBoletos = await serviceConsultaCliente.getTodosBoletos(state.idCliente);

            state.todosBoletos = todosBoletos
            state.modalTodosBoletosOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os boletos."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalDetalhesOrcamento(item) {
        try {
            state.loading = true;

            let param: iParamDetalhesOrc = {
                numOrcamento: item.NUM_ORCAMENTO,
                data: item.DATA
            }
            const detalhesOrcamento = await serviceConsultaCliente.getDetalhesOrcamento(param);
            state.itensOrcamento = detalhesOrcamento.itensOrcamento
            state.montagemOrcamento = detalhesOrcamento.montagemOrcamento

            state.modalDetalhesOrcamentoOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os dados do orçamento."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalDetalhesItemOrcamento(item) {
        try {
            state.loading = true;

            let param: iParamDetalhesItensOrc = {
                codProduto: item.COD_PRODUTO,
                idCliente: state.idCliente,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim
            }

            const detalhesItensOrcamento = await serviceConsultaCliente.getDetalhesItensOrcamento(param);
            state.detalhesItensOrcamento = detalhesItensOrcamento

            state.modalDetalhesItensOrcamentoOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os dados do item."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalDetalhesComprasFaturadas(item) {
        try {
            state.loading = true;

            let param: iParamComprasFaturadas = {
                numOrcamento: item.NUM_ORCAMENTO,
                data: item.DATA
            }

            const detalhesComprasFaturadas = await serviceConsultaCliente.getBoletosComprasFaturadas(param);
            state.detalhesComprasFaturadas = detalhesComprasFaturadas

            state.modalDetalhesComprasFaturadasOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os dados do item."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalDetalhesMarca(item) {
        try {
            state.loading = true;

            let param: iParamItensMarca = {
                idMarca: item.ID_MARCA,
                idCliente: item.ID_CLIENTE,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim
            }

            const detalhesItensMarca = await serviceConsultaCliente.getDetalhesItensMarca(param);
            state.detalhesItensMarca = detalhesItensMarca

            state.modalDetalhesItensMarcaOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os dados do item."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async openModalDetalhesCreditoDevolucao(item) {
        try {
            state.loading = true;

            let param: iParamDetalhesCredito = {
                numOrcamento: item.NUM_ORCAMENTO,
                dataOrcamento: item.DATA_ORCAMENTO
            }

            const detalhesCredito = await serviceConsultaCliente.getDetalhesCredito(param);
            state.detalhesUsoCredito = detalhesCredito.usoCredito
            state.detalhesItensCredito = detalhesCredito.itensCredito

            state.modalDetalhesCreditoOpened = true
        } catch {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os dados do item."
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    openModalDetalhesDevolucao(item) {
        console.log(item);
    }
}

export const graficoVendaPorVendedor = computed(() => {
    const cabecalho = [];
    const dados = [];

    if (state.graficoVendaPorVendedor.length > 0) {
        state.graficoVendaPorVendedor.forEach((item) => {
            cabecalho.push(item.VENDEDOR);
            dados.push(item.VENDAS);
        });
    }

    return {
        labels: cabecalho,
        series: dados,
    };
});

export const graficoVendasPorAno = computed(() => {
    const cabecalho = [];
    const dados = [];

    if (state.graficoVendasPorAno.length > 0) {
        state.graficoVendasPorAno.forEach((item) => {
            cabecalho.push(`Mês ${item.MES}`);
            dados.push(item.VALOR);
        });
    }

    return {
        labels: cabecalho,
        series: dados,
    };
});