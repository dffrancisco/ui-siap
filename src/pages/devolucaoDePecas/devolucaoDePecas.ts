import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceDevolucaodePecas from "./services/devolucaoDePecas.service";
import { iDetalhesDevolucao, iDevolucao } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const dataHoje = moment().format('YYYY-MM-DD')

export const state = reactive({
    dataInicio: moment().format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    selectedTipoData: 'DATA_VENDA',
    loading: false,
    dbDevolucoes: <iDevolucao[]>[],
    inputElementDataFim: <HTMLInputElement>{},
    modalDetalhesItensDevolucao: <iModalCreate>{},
    modalDetalhesItensDevolucaoOpened: false,
    detalhesDevolucaoSelecionada: <iDetalhesDevolucao[]>[],
    headers: <any>[
        {
            title: 'N° Devolução', key: 'NUM_DEVOLUCAO',
            align: 'center'
        },
        {
            title: 'N° Orçamento', key: 'NUM_ORCAMENTO',
            align: 'center'
        },
        {
            title: 'Data Orçamento', key: 'DATA',
            align: 'center',
            value: (item: iDevolucao) => utils.dataBrasil(item.DATA)
        },
        {
            title: 'Valor', key: 'VALOR',
            align: 'center',
            value: (item: iDevolucao) => utils.formatValor(item.VALOR)
        },
        {
            title: 'NF-e', key: 'NF_DEVOLUCAO',
            align: 'center',
        },
        {
            title: 'Crédito', key: 'CREDITO',
            align: 'center',
            value: (item: iDevolucao) => utils.formatValor(item.CREDITO)
        },
        {
            title: 'Funcionário', key: 'LOGIN',
            align: 'center'
        },
        {
            title: 'Status', key: 'STATUS',
            align: 'center'
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ],
    dataInicioImpressao: null,
    dataFimImpressao: null
})

export const actions = {
    async init() {
        actions.getDevolucoes()
        actions.createModal()
        state.inputElementDataFim = <HTMLInputElement>document.getElementById('DATA_FIM')
    },

    createModal() {
        state.modalDetalhesItensDevolucao = new xModal.create({
            el: "#modalDetalhesItensDevolucao",
            height: 400,
            width: 800,
            title: 'Detalhes itens devolução',
            theme: 'xModal-blue',
            onOpen: () => { state.modalDetalhesItensDevolucaoOpened = true; },
            onClose: () => { state.modalDetalhesItensDevolucaoOpened = false; },
        });
    },

    openModalDetalhesItensDevolucao(item) {
        state.loading = true;

        state.detalhesDevolucaoSelecionada = item.PRODUTOS.map((produto: iDetalhesDevolucao) => ({
            COD_PRODUTO: produto.COD_PRODUTO,
            QUAL_TIPO_AVARIA: produto.QUAL_TIPO_AVARIA,
            MOTIVO_DEVOLUCAO: produto.MOTIVO_DEVOLUCAO,
            DESC_PRODUTO: produto.DESC_PRODUTO
        }));

        state.modalDetalhesItensDevolucao.open()

        state.loading = false;
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? '' : 'cor-zebrada'
        return { class: classe }
    },

    async buscarDevolucoes() {
        let dataInicio = state.dataInicio ? moment(state.dataInicio) : null
        let dataFim = state.dataFim ? moment(state.dataFim) : null

        if (!dataInicio || !dataFim) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, insira uma data válida.',
            })
            return
        }

        if (dataInicio.isAfter(dataFim)) {
            Swal.fire({
                icon: 'warning',
                text: 'A data inicial deve ser menor que a data final.',
            })
            return;
        }

        await actions.getDevolucoes()
    },

    async getDevolucoes() {
        try {
            state.loading = true;

            let dataInicio = moment(state.dataInicio).format('YYYY-MM-DD');
            let dataFim = moment(state.dataFim).format('YYYY-MM-DD');

            let tipoData = state.selectedTipoData

            const data = await serviceDevolucaodePecas.getDevolucoes({ dataInicio, dataFim, tipoData })

            state.dbDevolucoes = data
            state.dataInicioImpressao = dataInicio
            state.dataFimImpressao = dataFim
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao buscar as devoluções!"
            })
        } finally {
            state.loading = false;
        }
    },

    getDadosImpresaoArquivo() {

        let dadosToPrint = state.dbDevolucoes.map((item) => {
            return {
                NUM_DEVOLUCAO: item.NUM_DEVOLUCAO ?? '',
                NUM_ORCAMENTO: item.NUM_ORCAMENTO ?? '',
                DATA: utils.dataBrasil(item.DATA) ?? '',
                VALOR: utils.formatValor(item.VALOR) ?? '',
                NF_DEVOLUCAO: item.NF_DEVOLUCAO ?? '',
                CREDITO: utils.formatValor(item.CREDITO) ?? '',
                LOGIN: item.LOGIN ?? '',
                STATUS: item.STATUS ?? ''
            }
        })

        let columns: iColumnPrint[] = [
            {
                key: 'NUM_DEVOLUCAO',
                label: "N° Devolução",
                align: 'center',
            },
            {
                key: 'NUM_ORCAMENTO',
                label: "N° Orçamento",
                align: 'center',
            },
            {
                key: 'DATA',
                label: "Data Orçamento",
                align: 'center',
            },
            {
                key: 'VALOR',
                label: "Valor",
                align: 'right',
            },
            {
                key: 'NF_DEVOLUCAO',
                label: "NF-e",
                align: 'center',
                width: "80%"
            },
            {
                key: 'CREDITO',
                label: "Crédito",
                align: 'right',
            },
            {
                key: 'LOGIN',
                label: "Funcionário",
            },
            {
                key: 'STATUS',
                label: "Status",
                align: 'center',
            }
        ];

        return { columns, dadosToPrint };
    },

    async onClickImprimir() {
        let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

        let titulo = `
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
      <span>Período: ${moment(state.dataInicioImpressao).format("DD/MM/YYYY")} até ${moment(state.dataFimImpressao).format(
            "DD/MM/YYYY"
        )}</span>
      <strong style="font-size: 20px">Devolução de Peças</strong>
      </div>
      `;

        try {
            state.loading = true

            await utils.printComCabecalho(columns, dadosToPrint, titulo);
        } catch (error) {
            console.error(error);
        } finally {
            state.loading = false
        }
    },
}