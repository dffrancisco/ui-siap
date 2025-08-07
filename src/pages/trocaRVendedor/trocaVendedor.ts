import { reactive } from "vue";
import { iOrcamento, iVendedor } from "./interfaces";
import Swal from "sweetalert2";
import servicetrocarVendedor from './services/trocarVendedor.service';


export const state = reactive({
    loading: false,
    orcamento: <iOrcamento>{},
    numOrcamento: '',
    vendedores: <iVendedor[]>[],

})


export const actions = {
async getOrcamento() {

    try {
        state.loading = true;
        state.orcamento = await servicetrocarVendedor.getOrcamento(parseInt(state.numOrcamento))

        if (!state.orcamento.NUM_ORCAMENTO) {
            Swal.fire({
                text: "Orçamento não encontrado",
                icon: "warning"
            })
            console.log(state.orcamento.NUM_ORCAMENTO)
        }

        if (state.orcamento.VALOR== 0) {
            Swal.fire({
                text: "Orçamento não possui montagem",
                icon: "warning"
            })
            state.orcamento = {} as iOrcamento
        }
    } catch (error) {
        Swal.fire({
            text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar orçamentos',
            icon: "error"
        })
    } finally {
        state.loading = false;
    }

    const getVendedores = async () => {
        try {
            state.vendedores = await servicetrocarVendedor.getVendedores();
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar montadores',
                icon: "error"
            })
        }
    }
}
}
export const init = async () => {
    try {
        state.loading = true;
        await getVendedores();
    } finally {
        state.loading = false;
    }
} 