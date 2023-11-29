import { reactive } from 'vue'
import Swal from 'sweetalert2';
import { iCliente, iMotorista, iTotalizador } from './interface';
import entregarReceberService from './services/entregarReceber.service';
import router from '@/router';

export const state = reactive(({
    motoristas: <iMotorista[]>[],
    clientes: <iCliente[]>[],
    qtdTotalPendenciasMotoristas: 0,
    totalizadores: <iTotalizador>{},
    loading: false,
}))


export const actions = {

    async getMotoristasPendentes() {

        try {
            state.qtdTotalPendenciasMotoristas = 0;
            state.motoristas = [];

            const motoristas = await entregarReceberService.getMotoristasPendentes();

            motoristas.forEach(motorista => {
                state.qtdTotalPendenciasMotoristas += motorista.QTD

                if (motorista.COD_FUNCIONARIO != -1) {
                    state.motoristas.push(motorista)
                }
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar os motoristas pendentes'
            })
        }
    },

    async getClientesPendentes() {

        try {
            state.clientes = await entregarReceberService.getClientesPendentes()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar os clientes pendentes'
            })
        }
    },

    async getTotalizadores() {

        try {
            state.totalizadores = await entregarReceberService.getTotalizadores()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar os totalizadores'
            })
        }
    },

    getFotoMontadorURL(cpf: string) {
        if (!cpf) {
            return "";
        }

        const cpfSanitizado = cpf.replaceAll('.', '').replaceAll('-', '');
        return `http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`
    },

    onClickMotorista(codFuncionario: number | null) {
        let query = {}

        if (codFuncionario) {
            query = {
                id_motorista: codFuncionario
            }
        }

        router.push({
            name: 'entregarReceberDetalhes',
            query,
        })
    },

    onClickCliente(idCliente: number | null) {
        let query = {}

        if (idCliente) {
            query = {
                id_cliente: idCliente
            }
        }

        router.push({
            name: 'entregarReceberDetalhes',
            query,
        })
    },

    async init() {
        state.loading = true;

        await actions.getMotoristasPendentes();
        await actions.getClientesPendentes();
        await actions.getTotalizadores();

        state.loading = false;
    }

}

export default { state, actions }