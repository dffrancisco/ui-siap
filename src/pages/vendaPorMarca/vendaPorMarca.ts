import utils from "@/ts/utils";
import { reactive } from "vue";

export const state = reactive({

    headers: <any>[
        { title: 'Marcas', key: 'DESCRICAO', align: 'center', width: '30%' },
        { title: 'Valor', key: 'VALOR', align: 'center' },
        { title: 'Qtd. Itens', key: 'QTD', align: 'center' },
        { title: 'Qtd. Média Itens', key: 'QTD_MEDIA_ITENS', align: 'center' },
        { title: 'Ticket Médio', key: 'TICKET_MEDIO', align: 'center' },
        { title: 'Percentual', key: 'PERCENTUAL', align: 'center' },
    ],

    itens: [
        {
            DESCRICAO: 'IMPORTADO TONG YANG',
            VALOR: utils.formatValor('20846.90'),
            QTD: 123,
            TICKET_MEDIO: utils.formatValor('169.48'),
            QTD_MEDIA_ITENS: 1,
            PERCENTUAL: '30%'
        },
    ],

    teste: ""
})

export default { state }