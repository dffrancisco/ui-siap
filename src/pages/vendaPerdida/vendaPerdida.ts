import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceVendasPerdidas from './services/vendaPerdida.service';
import moment from "moment";
import { mesesToSelect } from "@/constants/constants";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iGetDetalhesResponse, iGetVendasPerdidasResponse, iParamDetalhes, iParamGetVendasPerdidas } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";

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
    ],
    mesImpressao: null,
    anoImpressao: null
})


export const actions = {
    async init() {
        await actions.getVendasPerdidas()
        actions.createModalDetalhesVendaPerdida()
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
            state.mesImpressao = state.mes;
            state.anoImpressao = state.ano;
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

    getDadosImpresaoArquivo() {

        let dadosToPrint = state.vendasPerdidas.map((item) => {
            return {
                DESC_PRODUTO: item.DESC_PRODUTO ?? '',
                NUM_FABRICANTE: item.NUM_FABRICANTE ?? '',
                NUM_FABRICANTE2: item.NUM_FABRICANTE2 ?? '',
                DESC_MARCA: item.DESC_MARCA ?? '',
                QUANTIDADE: item.QUANTIDADE ?? '',
                QUANTIDADE_PERDIDA: item.QUANTIDADE_PERDIDA ?? '',
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
                key: 'QUANTIDADE_PERDIDA',
                label: "Vendas Perdidas",
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
      <strong style="font-size: 20px">Vendas Perdidas</strong>
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

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    }

}