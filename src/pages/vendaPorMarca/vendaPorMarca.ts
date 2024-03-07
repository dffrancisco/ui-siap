import utils from "@/ts/utils";
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceVendaPorMarca from "./services/vendaPorMarca.service";
import { iVendasPorMarca } from "./interfaces";

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

    mes: null,
    ano: null,

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
    }
}

export default { state }