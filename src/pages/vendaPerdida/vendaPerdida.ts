import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceVendasPerdidas from './services/vendaPerdida.service';
import moment from "moment";
import { mesesToSelect } from "@/constants/constants";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iGetVendasPerdidasResponse, iParamGetVendasPerdidas } from "./interfaces";
import printJS from "print-js";

export const state = reactive({
    loading: false,
    mes: new Date().getMonth() + 1,
    ano: moment().year(),
    totalItems: 0,
    itemsPerPage: 50,
    vendasPerdidas: [],
    search: "",
    vendaPerdidaDetalhada: <iGetVendasPerdidasResponse>{},
    modalDetalhesVendaPerdida: <iModalCreate>{},
    modalDetalhesVendaPerdidaOpened: false,
    headers: <any>[
        {
            title: "Produto",
            key: "DESC_PRODUTO",
            sortable: true,
        },
        {
            title: "Fabricante",
            key: "NUM_FABRICANTE",
            sortable: true,
            align: 'end'
        },
        {
            title: "Fabricante2",
            key: "NUM_FABRICANTE2",
            sortable: true,
            align: 'end'
        },
        {
            title: "Marca",
            key: "DESC_MARCA",
            sortable: true,
            align: 'end'
        },
        {
            title: "Qtd em estoque",
            key: "QUANTIDADE",
            sortable: true,
            align: 'end'
        },
        {
            title: "Vendas perdidas",
            key: "QUANTIDADE_PERDIDA",
            sortable: true,
            sortBy: "desc"

        },
        {
            title: 'Inf',
            key: 'inf',
            sortable: false,
            align: 'center',
        },
    ]
})

export const meses = mesesToSelect;

export const vendasPerdidas = computed(() => {

});

export const actions = {
    async init() {
        await actions.getVendasPerdidas()
    },

    async getVendasPerdidas() {
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
            onClose: () => { state.modalDetalhesVendaPerdidaOpened = false; state.modalDetalhesVendaPerdida.destroy() },
        });

    },

    async openModalDetalhesVendaPerdida(item: iGetVendasPerdidasResponse) {
        state.loading = true;

        state.vendaPerdidaDetalhada = item

        actions.createModalDetalhesVendaPerdida()
        state.modalDetalhesVendaPerdida.open();

        state.loading = false;
    },

    async imprimirVendasPerdidas() {
        const tableHtml = `
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <thead>
            <tr>
              ${state.headers
                .filter((header: any) => header.key !== 'inf')
                .map((header: any) => `<th style="border: 1px solid #ddd; padding: 8px;">${header.title}</th>`)
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${state.vendasPerdidas.map((item: iGetVendasPerdidasResponse, index: number) => `
              <tr style="background-color: ${index % 2 === 0 ? '#fff' : '#f0f0f0'};">
                <td style="border: 1px solid #ddd; padding: 8px;">${item.DESC_PRODUTO}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.NUM_FABRICANTE ?? ''}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.NUM_FABRICANTE2 ?? ''}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.DESC_MARCA ?? ''}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.QUANTIDADE ?? ''}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.QUANTIDADE_PERDIDA}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        `;

        printJS({
            printable: tableHtml,
            type: 'raw-html',
        });
    }

}