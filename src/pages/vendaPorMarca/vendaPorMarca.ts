import utils, { iColumnPrint } from "@/ts/utils";
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceVendaPorMarca from "./services/vendaPorMarca.service";
import { iVendasPorMarca } from "./interfaces";
import moment from "moment";

export const dadosFormatToPrint = computed(() => {
    return state.dbVendasPorMarca.map(venda => ({
        ...venda,
        VALOR: utils.formatValor(venda.VALOR),
        TICKET_MEDIO: utils.formatValor(venda.TICKET_MEDIO)
    }));
})

export const state = reactive({

    headers: <any>[
        { title: 'Marcas', key: 'DESCRICAO', align: 'center', width: '30%' },
        { title: 'Valor (R$)', key: 'VALOR', align: 'center', value: (venda: iVendasPorMarca) => utils.formatValor(venda.VALOR) },
        { title: 'Qtd. Itens', key: 'QTD', align: 'center' },
        { title: 'Qtd. Média Itens', key: 'QTD_MEDIA_ITENS', align: 'center' },
        { title: 'Ticket Médio (R$)', key: 'TICKET_MEDIO', align: 'center', value: (venda: iVendasPorMarca) => utils.formatValor(venda.TICKET_MEDIO) },
        { title: 'Percentual (%)', key: 'PERCENTUAL', align: 'center' }
    ],

    dbVendasPorMarca: <iVendasPorMarca[]>[],

    mes: moment().month() + 1,
    ano: moment().year(),

    edtAno: <HTMLInputElement>{},

    loading: false
})

export const actions = {
    async init() {
        state.edtAno = <any>document.getElementById("ANO");
    },

    async getVendasPorMarca() {
        try {
            state.loading = true;

            let param = {
                MES: state.mes,
                ANO: state.ano
            }

            const data = await serviceVendaPorMarca.getVendasPorMarca({ param })

            let totalVendas = 0;

            data.forEach(venda => {
                totalVendas += venda.VALOR;
            });

            data.forEach(venda => {
                venda.PERCENTUAL = ((venda.VALOR / totalVendas) * 100).toFixed(2);
            })

            state.dbVendasPorMarca = data

            state.loading = false;

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as vendas por marca!",
            })
        }
    },

    getDadosImpresaoArquivo() {

        let dadosToPrint = state.dbVendasPorMarca.map((item) => {
            return {
                DESCRICAO: item.DESCRICAO ?? '',
                VALOR: utils.formatValor(item.VALOR) ?? '',
                QTD: item.QTD ?? '',
                QTD_MEDIA_ITENS: item.QTD_MEDIA_ITENS ?? '',
                TICKET_MEDIO: utils.formatValor(item.TICKET_MEDIO) ?? '',
                PERCENTUAL: utils.formatValor(item.PERCENTUAL) ?? '',
            }
        })

        let columns: iColumnPrint[] = [
            {
                key: 'DESCRICAO',
                label: "Marcas",
                width: '40%'
            },
            {
                key: 'VALOR',
                label: "Valor",
                align: 'right',
                width: '20%'
            },
            {
                key: 'QTD',
                label: "Qtd",
                align: 'center',
                width: '10%'
            },
            {
                key: 'QTD_MEDIA_ITENS',
                label: "Qtd. Média Itens",
                align: 'center',
                width: '10%'
            },
            {
                key: 'TICKET_MEDIO',
                label: "Ticket Médio",
                align: 'right',
                width: '20%'
            },
            {
                key: 'PERCENTUAL',
                label: "Percentual",
                align: 'right',
            },
        ];

        return { columns, dadosToPrint };
    },

    async onClickImprimir() {
        let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

        let titulo = `
      <div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 10px">
        <strong style="font-size: 20px">Vendas por Marca</strong>
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

export default { state }