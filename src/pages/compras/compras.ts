import { computed, reactive } from 'vue'
import comprasService from './services/compras.service'
import Swal from 'sweetalert2'
import { iCompra, objMarcasAgrupadas } from './interfaces'
import moment from 'moment'

export const state = reactive(({
    edtMarca: '',
    compras: <iCompra[]>[],
    loading: false,
}))

export const actions = {
    init: async () => {
        state.loading = true;
        await actions.getCompras();
        state.loading = false;
    },

    getCompras: async () => {
        try {
            let dados = await comprasService.getCompras()
            state.compras = dados;
        } catch (error) {
            Swal.fire({
                text: 'Ocorreu um erro ao buscar as compras',
                icon: 'error'
            })
        }
    },

    onClickNovoPedido: () => {
        console.log('oi');
    }
}

export const marcasAgrupadas = computed(() => {
    let objMarcasAgrupadas: objMarcasAgrupadas = {}

    state.compras.forEach(compra => {
        if (objMarcasAgrupadas[compra.NOME_MARCA] == undefined) {
            objMarcasAgrupadas[compra.NOME_MARCA] = {
                qtd: 0,
                valor: 0,
                nomeMarca: compra.NOME_MARCA
            }
        }

        objMarcasAgrupadas[compra.NOME_MARCA].qtd++;
        objMarcasAgrupadas[compra.NOME_MARCA].valor += compra.VALOR
    })

    return Object.values(objMarcasAgrupadas)
        .sort((marcaA, marcaB) => {
            return marcaB.valor - marcaA.valor
        });
})

export const valorPendente = computed(() => {
    let valorTotal = 0
    state.compras.forEach(compra => valorTotal += compra.VALOR)

    return valorTotal;
})

export const qtdPedidosMaisDe20Dias = computed(() => {
    let pedidos = state.compras.filter(compra => {
        let dataPedido = compra.DATA
        let dataLimite = moment(dataPedido).add(20, 'days');
        return moment().isAfter(dataLimite) ? true : false;
    })

    return pedidos.length;
})

export default { state, actions }