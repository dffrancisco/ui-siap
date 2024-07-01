import { mesesToSelect } from "@/constants/constants";
import serviceHistoricoConsultaLojas from './services/historicoConsultaLojas.service'
import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import { iGetHistoricoConsultaLojasResponse } from "./interfaces";
import printJS from "print-js";

export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || "",
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
    ]
})

export const actions = {
    async init() {
        await actions.validarInputs()
    },

    validarInputs() {
        if (state.ano === "" || state.ano > ano.toString()) {
            Swal.fire({
                icon: "error",
                text: "Insira um ano válido para continuar"
            });
            return
        }

        if (state.mes > mes) {
            Swal.fire({
                icon: "error",
                text: "Insira um mês válido para continuar"
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

    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            NUM_FABRICANTE: item.NUM_FABRICANTE ? item.NUM_FABRICANTE : '',
            NUM_FABRICANTE2: item.NUM_FABRICANTE2 ? item.NUM_FABRICANTE2 : '',
        }))
    },

    async imprimirVendasPerdidas() {
        state.loading = true;

        const historicoConsultaLojas = actions.formatarDadosImpressao(state.historicoConsultaLojas)

        printJS({
            printable: historicoConsultaLojas,
            type: "json",
            documentTitle: 'Vendas Perdidas - Período: ' + state.mes + '/' + state.ano,
            gridHeaderStyle: "border: 1px solid #000000;",
            gridStyle: "text-align: center; padding: 5px; border: 1px solid #000000",
            properties: [
                { field: 'DESC_PRODUTO', displayName: 'Descrição do Produto' },
                { field: 'NUM_FABRICANTE', displayName: 'Número do Fabricante' },
                { field: 'NUM_FABRICANTE2', displayName: 'Número do Fabricante 2' },
                { field: 'DESC_MARCA', displayName: 'Marca' },
                { field: 'QUANTIDADE', displayName: 'Qtd atual em estoque ' },
                { field: 'QTD_CONSULTA_LOJAS', displayName: 'Qtd consulta lojas' }
            ]
        });

        state.loading = false;
    },
}