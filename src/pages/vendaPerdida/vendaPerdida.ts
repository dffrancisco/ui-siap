import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceVendasPerdidas from './services/vendaPerdida.service';
import moment from "moment";
import { mesesToSelect } from "@/constants/constants";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iGetDetalhesResponse, iGetVendasPerdidasResponse, iParamDetalhes, iParamGetVendasPerdidas } from "./interfaces";
import printJS from "print-js";

export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || "",
    totalItems: 0,
    vendasPerdidas: <iGetVendasPerdidasResponse[]>[],
    vendaPerdidaDetalhada: <iGetDetalhesResponse[]>[],
    modalDetalhesVendaPerdida: <iModalCreate>{},
    modalDetalhesVendaPerdidaOpened: false,
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
            title: "Qtd atual estoque",
            key: "QUANTIDADE",
            sortable: true,
            align: 'center'
        },
        {
            title: "Vendas perdidas",
            key: "QUANTIDADE_PERDIDA",
            sortable: true,
            sortBy: "desc",
            align: 'center'
        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ]
})


export const actions = {
    async init() {
        await actions.getVendasPerdidas()
        await actions.createModalDetalhesVendaPerdida()
    },

    async getVendasPerdidas() {

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

        try {
            state.loading = true;
            let dataInicio = moment(`${state.ano}-${state.mes}-01`, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
            let dataFim = moment(`${state.ano}-${state.mes}-01`, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');

            let param: iParamGetVendasPerdidas = {
                DATA_INICIO: dataInicio,
                DATA_FIM: dataFim
            }

            let data = await serviceVendasPerdidas.getVendasPerdidas(param);
            state.vendasPerdidas = data;
            state.totalItems = data.length;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as vendas perdidas!"
            });
        } finally {
            state.loading = false;
        }
    },

    createModalDetalhesVendaPerdida() {
        state.modalDetalhesVendaPerdida = new xModal.create({
            el: "#modalVendaPerdidaDetalhes",
            height: 400,
            width: 800,
            title: 'Detalhes venda perdida',
            theme: 'xModal-blue',
            onOpen: () => { state.modalDetalhesVendaPerdidaOpened = true; },
            onClose: () => { state.modalDetalhesVendaPerdidaOpened = false; },
        });
    },

    async openModalDetalhesVendaPerdida(item: iGetVendasPerdidasResponse) {
        state.loading = true;

        try {
            state.loading = true;
            let dataInicio = moment(`${state.ano}-${state.mes}-01`, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
            let dataFim = moment(`${state.ano}-${state.mes}-01`, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');

            let param: iParamDetalhes = {
                DATA_INICIO: dataInicio,
                DATA_FIM: dataFim,
                COD_PRODUTO: item.COD_PRODUTO
            }

            let data = await serviceVendasPerdidas.getVendaPerdidaDetalhes(param);
            state.vendaPerdidaDetalhada = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os detalhes da venda perdida."
            });
            return;
        } finally {
            state.loading = false;
        }

        state.modalDetalhesVendaPerdida.open();

        state.loading = false;
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

        const vendasPerdidasImpressao = actions.formatarDadosImpressao(state.vendasPerdidas)

        printJS({
            printable: vendasPerdidasImpressao,
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
                { field: 'QUANTIDADE_PERDIDA', displayName: 'Vendas Perdidas' }
            ]
        });

        state.loading = false;
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    }

}