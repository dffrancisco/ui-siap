import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import { iClienteFaturado, iGetOrcamentosClienteFaturadoParam, iOrcamentosClienteFaturado } from "./interfaces";
import serviceRelatorioFaturamento from "./services/relatorioFaturamento.service";
import moment from "moment";
import Swal from "sweetalert2";
import utils, { iColumnPrint } from "@/ts/utils";

export const state = reactive({
    gridOrcamentosFaturados: <ixGridCreate>{},
    clienteSelecionado: <iClienteFaturado>{},
    modalSelecionarClienteFaturadoOpened: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    loading: false,
    setDataInicio: null,
    setDataFim: null,
})

export const actions = {
    async init() {
        actions.createGrid()
    },

    async openModalSelecionarCliente() {
        if (!state.dataInicio || !state.dataFim) {
            await Swal.fire({
                text: "Data Inválida!",
                icon: "warning"
            })
            return;
        }

        if (moment(state.dataInicio).isAfter(moment(state.dataFim))) {
            await Swal.fire({
                text: "Data inicial deve ser menor que a data final!",
                icon: "warning"
            });
            return false;
        }

        state.modalSelecionarClienteFaturadoOpened = true;
    },

    getDadosImpresaoArquivo() {

        // @ts-ignore
        let dadosToPrint = state.gridOrcamentosFaturados.data().map((item) => {
            return {
                NUM_NFE: item.NUM_NFE ?? '',
                NUM_ORCAMENTO: item.NUM_ORCAMENTO ?? '',
                DATA: utils.dataBrasil(item.DATA) ?? '',
                DEVOLUCAO: utils.formatValor(item.DEVOLUCAO) ?? '',
                DESCONTO: utils.formatValor(item.DESCONTO) ?? '',
                MONTAGEM: utils.formatValor(item.MONTAGEM) ?? '',
                VALOR: utils.formatValor(item.VALOR) ?? '',
            }
        })

        let columns: iColumnPrint[] = [
            {
                key: 'NUM_NFE',
                label: "N° Fiscal",
                width: '15%',
                align: "center",
            },
            {
                key: 'NUM_ORCAMENTO',
                label: "N° Orçamento",
                align: 'center',
                width: '15%'
            },
            {
                key: 'DATA',
                label: "Data",
                align: 'center',
                width: '15%'
            },
            {
                key: 'DEVOLUCAO',
                label: "Devolução",
                align: 'right',
                width: '15%'
            },
            {
                key: 'DESCONTO',
                label: "Desconto",
                align: 'right',
                width: '15%'

            },
            {
                key: 'MONTAGEM',
                label: "Valor Montagem",
                align: 'right',
                width: '15%'

            },
            {
                key: 'VALOR',
                label: "Valor Orçamento",
                align: 'right',
                width: '15%'

            },
        ];

        return { columns, dadosToPrint };
    },

    async calcularOrcamentosToPrint() {

        //@ts-ignore
        const dados = state.gridOrcamentosFaturados.data() as iOrcamentosClienteFaturado[]

        let totalOrcamentos = 0;
        let totalMontagem = 0;
        let totalDevolucao = 0;
        let totalLiquido = 0;


        dados.forEach(orcamento => {

            totalDevolucao += orcamento.DEVOLUCAO || 0;

            totalMontagem += orcamento.MONTAGEM || 0;

            totalLiquido += (orcamento.VALOR || 0) - (orcamento.DEVOLUCAO || 0) + orcamento.MONTAGEM;

            totalOrcamentos += orcamento.VALOR || 0;
        });

        return {
            totalOrcamentos,
            totalDevolucao,
            totalMontagem,
            totalLiquido
        }
    },

    async onClickImprimir() {
        let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo()

        let titulo = `
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px; align-items: center">
        <span>Período: ${moment(state.setDataInicio).format('DD/MM/YYYY')} - ${moment(state.setDataFim).format('DD/MM/YYYY')}</span>
        <span>Quantidade de Itens: ${dadosToPrint.length}</span>
        <strong style="font-size: 20px">Relatório de Pedido</strong>
      </div>
      <div style="margin: 4px">
        <span>Cliente: <strong>${state.clienteSelecionado.NOME}</strong></span>
      </div>
      `;

        let { totalLiquido, totalDevolucao, totalOrcamentos, totalMontagem } = await actions.calcularOrcamentosToPrint()

        let footer =
            `<div style="margin-top: 16px; display: flex; justify-content: space-between;">
                <span style="font-size: 14px;">Total Líquido: ${utils.formatValor(totalLiquido)}</span>
                <span style="font-size: 14px;">Total Devolução: ${utils.formatValor(totalDevolucao)}</span>
                <span style="font-size: 14px;">Total Montagem: ${utils.formatValor(totalMontagem)}</span>
                <span style="font-size: 14px;">Total Orçamentos: ${utils.formatValor(totalOrcamentos)}</span>
             </div>`;

        try {
            state.loading = true

            await utils.printComCabecalho(columns, dadosToPrint, titulo, footer);
        } catch (error) {
            Swal.fire({
                title: "Erro ao imprimir!",
                text: error.message,
                icon: "error",
            })
        } finally {
            state.loading = false
        }
    },

    async createGrid() {
        state.gridOrcamentosFaturados = new xGridV2.create({
            el: "#gridOrcamentosFaturados",
            height: 416,
            columns: {
                "N° Fiscal": { dataField: "NUM_NFE", center: true, width: '10%' },
                "N° Orçamento": { dataField: "NUM_ORCAMENTO", center: true, width: '10%' },
                "Data da Saida": { dataField: "DATA", center: true, width: '15%', render: utils.dataBrasil },
                "Devolução": { dataField: "DEVOLUCAO", right: true, width: '15%', render: utils.formatValor },
                "Desconto": { dataField: "DESCONTO", right: true, render: utils.formatValor },
                "Valor Montagem": { dataField: "MONTAGEM", right: true, render: utils.formatValor },
                "Valor Orçamento": { dataField: "VALOR", right: true, render: utils.formatValor },
            },
        })
    },

    async getOrcamentosFaturados(cliente: iClienteFaturado) {
        try {
            state.loading = true;

            state.clienteSelecionado = cliente;

            state.setDataInicio = state.dataInicio
            state.setDataFim = state.dataFim

            let param: iGetOrcamentosClienteFaturadoParam = {
                dataInicio: state.setDataInicio,
                dataFim: state.setDataFim,
                id_cliente: state.clienteSelecionado.ID_CLIENTE
            }

            const data = await serviceRelatorioFaturamento.getOrcamentosClienteFaturado(param)

            state.gridOrcamentosFaturados.source(data)

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os orçamentos faturados."
            })
        } finally {
            state.loading = false
        }
    }
}