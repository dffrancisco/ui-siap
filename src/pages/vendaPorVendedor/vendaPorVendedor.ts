import { computed, reactive } from "vue";
import {
    iVenda,
    iParamGetVendas,
    iParamGetVendasDetalhes,
    iGetVendasDetalhesResponse,
    iGrupoImpressao,
} from "./interfaces";
import serviceVendasPorVendedor from './services/vendaPorVendedor.service'
import Swal from "sweetalert2";
import moment from "moment";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const vendasOrdenadas = computed(() => {
    let vendas = [];

    if (state.grupoSelecionado.length > 0) {
        let vendasGrupo = [];

        state.grupoSelecionado.forEach(index => {
            let funcionarios = state.dbGrupoImpressao[index].FUNCIONARIOS;

            funcionarios.forEach(funcionario => {
                let vendasFuncionario = state.dbVenda.filter(venda =>
                    venda.COD_FUNCIONARIO == funcionario.COD_FUNCIONARIO
                );

                vendasGrupo = vendasGrupo.concat(vendasFuncionario);
            })

        });

        vendas = [...vendasGrupo];
    } else {
        vendas = [...state.dbVenda];
    }

    let totalLimite = 0;
    let totalDevolucoes = 0;
    let totalValorVenda = 0;
    let totalValorLiquido = 0;
    let totalQtdItens = 0;
    let totalQtdVendas = 0;

    vendas.forEach(venda => {

        totalLimite += venda.LIMITE;
        totalDevolucoes += venda.VALOR_DEVOLUCAO;
        totalValorVenda += venda.VALOR_VENDA;
        totalValorLiquido += venda.VENDA_LIQUIDA;
        totalQtdItens += venda.QTD_ITENS;
        totalQtdVendas += venda.QTD_VENDAS;
    });

    vendas.sort((a, b) => b.VALOR_VENDA - a.VALOR_VENDA);

    if (vendas.length > 0) {
        let totalizador = {
            LOGIN: 'Totalizador',
            LIMITE: totalLimite,
            VALOR_VENDA: totalValorVenda,
            VALOR_DEVOLUCAO: totalDevolucoes,
            VENDA_LIQUIDA: totalValorLiquido,
            TICKET_MEDIO: totalValorLiquido / totalQtdVendas,
            QTD_MEDIA_ITENS: totalQtdItens / totalQtdVendas
        };

        vendas.push(totalizador);
    }

    return vendas;
});

export const dadosToPrint = computed(() => {
    let dadosFiltrados = vendasOrdenadas.value.filter(venda => venda.LOGIN != 'Totalizador');

    return dadosFiltrados;
});


export const dataHoje = moment().format('YYYY-MM-DD')

export const state = reactive({
    dbVenda: <iVenda[]>[],
    dbVendasDetalhes: <iGetVendasDetalhesResponse>{},
    dbGrupoImpressao: <iGrupoImpressao[]>[],

    modalVendasDetalhes: <iModalCreate>{},
    modalVendasDetalhesOpened: false,

    modalVendasGraficos: <iModalCreate>{},
    modalVendasGraficosOpened: false,

    modalImprimirVendas: <iModalCreate>{},
    modalImprimirVendasOpened: false,

    headers: <any>[
        { title: 'Vendedor', key: 'LOGIN', width: '30%' },
        {
            title: 'Limite Crédito', key: 'LIMITE',
            align: 'end'
        },
        {
            title: 'Venda', key: 'VALOR_VENDA',
            align: 'end'
        },
        {
            title: 'Devolução', key: 'VALOR_DEVOLUCAO',
            align: 'end'
        },
        {
            title: 'Ved.Líquida', key: 'VENDA_LIQUIDA',
            align: 'end'
        },
        {
            title: 'Ticket Médio', key: 'TICKET_MEDIO',
            align: 'end'
        },
        {
            title: 'Qtd. Média Itens', key: 'QTD_MEDIA_ITENS',
            align: 'end'
        },
        { title: 'Inf', key: 'inf', sortable: false, align: 'center', },
    ],

    dataInicial: moment().format('YYYY-MM-DD'),
    dataFinal: moment().format('YYYY-MM-DD'),

    dataInicialModal: null,
    dataFinalModal: null,

    inputDataInicial: <HTMLInputElement>{},
    inputDataFinal: <HTMLInputElement>{},

    grupoSelecionado: [],

    loading: false,
})

export const actions = {
    async pesquisarVendas() {
        if (!state.dataInicial || !state.dataFinal) {
            await Swal.fire({
                text: "Data Inválida!",
                icon: "warning"
            })
            return;
        }

        if (moment(state.dataInicial).isAfter(moment(state.dataFinal))) {
            await Swal.fire({
                text: "Data Inicial deve ser menor que a data final.",
                icon: "warning"
            })
            return;
        }

        await actions.getVendas();
    },

    async init() {
        state.inputDataInicial = <any>document.getElementById("DATA_INICIAL");
        state.inputDataFinal = <any>document.getElementById("DATA_FINAL");

        actions.createModais()

        await actions.getGruposImpressao();
        await actions.getVendas();
    },

    createModalVendasDetalhes(nomeVendedor: string) {
        state.modalVendasDetalhes = new xModal.create({
            el: "#modalVendasDetalhes",
            height: 660,
            width: 1000,
            title: nomeVendedor,
            theme: 'xModal-blue',
            onOpen: () => { state.modalVendasDetalhesOpened = true; },
            onClose: () => { state.modalVendasDetalhesOpened = false; state.modalVendasDetalhes.destroy() },
        });

    },

    createModais() {
        state.modalVendasGraficos = new xModal.create({
            el: "#modalVendasGraficos",
            height: 660,
            width: 850,
            title: 'Gráficos',
            theme: 'xModal-blue',
            onOpen: () => { state.modalVendasGraficosOpened = true; },
            onClose: () => { state.modalVendasGraficosOpened = false; },
        });

        state.modalImprimirVendas = new xModal.create({
            el: "#modalImprimirVendas",
            height: 660,
            width: 1030,
            title: 'Imprimir Consulta de Vendas',
            theme: 'xModal-blue',
            onOpen: () => { state.modalImprimirVendasOpened = true; },
            onClose: () => { state.modalImprimirVendasOpened = false; },
        });

    },

    async openModalVendasDetalhes(nomeVendedor: string, id_vendedor: number) {
        state.loading = true;

        actions.createModalVendasDetalhes(nomeVendedor)
        await actions.getVendasDetalhes(id_vendedor)
        state.modalVendasDetalhes.open();

        state.loading = false;
    },

    openModalVendasGraficos() {
        state.modalVendasGraficos.open()
    },

    openModalImprimirVendas() {
        state.modalImprimirVendas.open()
    },

    async getVendas() {
        try {
            state.loading = true

            let param: iParamGetVendas = {
                DATA_INICIO: state.dataInicial,
                DATA_FIM: state.dataFinal
            }

            let data = await serviceVendasPorVendedor.getVendas(param);

            state.dbVenda = []

            data.map(venda => {
                state.dbVenda.push({
                    LOGIN: venda.LOGIN,
                    COD_FUNCIONARIO: venda.COD_FUNCIONARIO,
                    VALOR_VENDA: venda.VALOR_VENDA,
                    VALOR_DEVOLUCAO: venda.VALOR_DEVOLUCAO,
                    VENDA_LIQUIDA: venda.VENDA_LIQUIDA,
                    TICKET_MEDIO: venda.TICKET_MEDIO,
                    LIMITE: venda.LIMITE,
                    QTD_ITENS: venda.QTD_ITENS,
                    QTD_VENDAS: venda.QTD_VENDAS,
                    QTD_MEDIA_ITENS: venda.QTD_ITENS / venda.QTD_VENDAS
                })
            })

            state.dataInicialModal = state.dataInicial
            state.dataFinalModal = state.dataFinal

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: error?.response?.data?.msg || 'Erro ao exibir as vendas!'
            })
        }
    },

    async getVendasDetalhes(id_vendedor: number) {
        try {
            let param: iParamGetVendasDetalhes = {
                DATA_INICIO: state.dataInicialModal,
                DATA_FIM: state.dataFinalModal,
                ID_VENDEDOR: id_vendedor
            }

            let data = await serviceVendasPorVendedor.getVendasDetalhes(param);

            state.dbVendasDetalhes = data
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir os detalhes das vendas!'
            })
        }
    },

    async getGruposImpressao() {
        try {
            state.loading = true;
            const data = await serviceVendasPorVendedor.getGruposImpressao();
            state.dbGrupoImpressao = data
            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir os grupos de impressão!'
            })
        }
    }
}

export default { state, actions }