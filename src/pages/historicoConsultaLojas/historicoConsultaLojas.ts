import { mesesToSelect } from "@/constants/constants";
import serviceHistoricoConsultaLojas from './services/historicoConsultaLojas.service'
import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import { iGetHistoricoConsultaLojasResponse } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";

export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || null,
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    historicoConsultaLojas: <iGetHistoricoConsultaLojasResponse[]>[],
    headers: <any>[
        {
            title: "Produto",
            key: "DESC_PRODUTO",
            sortable: true,
        },
        {
            title: "Nº Fabricante",
            key: "NUM_FABRICANTE",
            sortable: true,
            align: 'center',
            width: '130px'
        },
        {
            title: "Nº Fabricante 2",
            key: "NUM_FABRICANTE2",
            sortable: true,
            align: 'center',
            width: '130px'
        },
        {
            title: "Marca",
            key: "DESC_MARCA",
            sortable: true,
            align: 'start'
        },
        {
            title: "Qtd Atual Estoque",
            key: "QUANTIDADE",
            sortable: true,
            align: 'center'
        },
        {
            title: "Qtd Consultas",
            key: "QTD_CONSULTA_LOJAS",
            sortable: true,
            sortBy: "desc",
            align: 'center'
        }
    ],
    mesImpressao: null,
    anoImpressao: null
})

export const actions = {
    async init() {
        actions.validarInputs()
    },

    validarInputs() {

        let dataFormatada = moment({ year: state.ano, month: state.mes - 1, day: 1 })

        if (dataFormatada.isAfter(moment())) {
            Swal.fire({
                icon: "warning",
                text: "Insira uma data válida para continuar"
            });
            return
        }

        actions.getHistoricoConsultaLojas();
    },

    async getHistoricoConsultaLojas() {
        try {
            state.loading = true;

            const data = await serviceHistoricoConsultaLojas.getHistoricoConsultaLojas({
                page: state.page,
                itemsPerPage: state.itemsPerPage,
                mes: state.mes,
                ano: state.ano,
            });
            state.historicoConsultaLojas = data.historicoConsultaLojas;
            state.totalItems = data.total[0].TOTAL;

            state.mesImpressao = state.mes
            state.anoImpressao = state.ano

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as consultas lojas!"
            });
        } finally {
            state.loading = false;
        }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getHistoricoConsultaLojas();
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    getDadosImpresaoArquivo() {

        let dadosToPrint = state.historicoConsultaLojas.map((item) => {
            return {
                DESC_PRODUTO: item.DESC_PRODUTO ?? '',
                NUM_FABRICANTE: item.NUM_FABRICANTE ?? '',
                NUM_FABRICANTE2: item.NUM_FABRICANTE2 ?? '',
                DESC_MARCA: item.DESC_MARCA ?? '',
                QUANTIDADE: item.QUANTIDADE ?? '',
                QTD_CONSULTA_LOJAS: item.QTD_CONSULTA_LOJAS ?? '',
            }
        })

        let columns: iColumnPrint[] = [
            {
                key: 'DESC_PRODUTO',
                label: "Produto",
                width: '60%'
            },
            {
                key: 'NUM_FABRICANTE',
                label: "N° Fabricante",
                align: 'center',
                width: '10%'
            },
            {
                key: 'NUM_FABRICANTE2',
                label: "N° Fabricante 2",
                align: 'center',
                width: '15%'
            },
            {
                key: 'DESC_MARCA',
                label: "Marca",
            },
            {
                key: 'QUANTIDADE',
                label: "Qtd Estoque",
                align: 'center',
            },
            {
                key: 'QTD_CONSULTA_LOJAS',
                label: "Qtd Consultas",
                align: 'center',
            },
        ];

        return { columns, dadosToPrint };
    },

    async onClickImprimir() {
        let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

        let titulo = `
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
      <span>Período: ${meses.find((mes) => mes.value === state.mesImpressao)?.title} ${state.anoImpressao}</span>
      <strong style="font-size: 20px">Historico Consulta Loja </strong>
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