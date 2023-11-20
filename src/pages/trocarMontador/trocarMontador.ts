import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceTrocarMontador from './services/trocarMontador.service';
import { iMontador, iOrcamento } from "./interface";
import xAuthManager from "@/plugins/xAuthManager";

export const state = reactive({
    loading: false,
    montadores: <iMontador[]>[],
    novoMontador: <iMontador>{
        NOME_MONTADOR: ''
    },
    orcamento: <iOrcamento>{},
    numOrcamento: ''
})

export const init = async () => {
    try {
        state.loading = true;
        await getMontadores();
    } finally {
        state.loading = false;
    }
}

const getMontadores = async () => {
    try {
        state.montadores = await serviceTrocarMontador.getMontadores();
    } catch (error) {
        Swal.fire({
            text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar montadores',
            icon: "error"
        })
    }
}

const clearNovoMontador = () => {
    state.novoMontador = {
        NOME_MONTADOR: '',
        COD_FUNCIONARIO: undefined,
        CPF: '',
    }
}

export const getOrcamento = async () => {
    clearNovoMontador();

    try {
        state.loading = true;
        state.orcamento = await serviceTrocarMontador.getOrcamento(parseInt(state.numOrcamento))

        if (!state.orcamento.NUM_ORCAMENTO) {
            Swal.fire({
                text: "Orçamento não encontrado",
                icon: "warning"
            })
        }

        if (state.orcamento.VALOR_MONTAGEM == 0) {
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
}

export const onClickTrocar = async () => {

    if (!state.novoMontador.COD_FUNCIONARIO) {
        return Swal.fire({
            text: "Selecione o montador",
            icon: "warning"
        })
    }

    if (state.novoMontador.COD_FUNCIONARIO == state.orcamento.ID_MONTADOR) {
        return Swal.fire({
            text: "O novo montador não pode ser igual ao montador atual",
            icon: "warning"
        })
    }

    xAuthManager("Autorizar troca de montador", async (dados) => {
        try {
            state.loading = true;
            state.orcamento = await serviceTrocarMontador.updateMontador({
                ID_MONTADOR: state.novoMontador.COD_FUNCIONARIO,
                ID_ORDEMDESERVICO: state.orcamento.ID_ORDEMDESERVICO,
                NUM_ORCAMENTO: state.orcamento.NUM_ORCAMENTO,
                COD_FUNCIONARIO: parseInt(dados.cod_funcionario)
            });

            clearNovoMontador();

            Swal.fire({
                text: "Montador alterado com sucesso",
                icon: "success"
            })
        } catch (error) {
            Swal.fire({
                text: error?.response?.data?.msg || 'Ocorreu um erro ao atualizar montador',
                icon: "error"
            })
        } finally {
            state.loading = false
        }
    });

}

export const urlAvatarMontador = computed(() => {
    if (!state.orcamento.CPF) {
        return "";
    }

    const cpf = state.orcamento.CPF.replaceAll('.', '').replaceAll('-', '');
    return `http://www.reallatas.com.br/foto_funcionarios/${cpf}.jpg`
})

export const urlAvatarNovoMontador = computed(() => {
    if (!state.novoMontador.CPF) {
        return "";
    }

    const cpf = state.novoMontador.CPF.replaceAll('.', '').replaceAll('-', '');
    return `http://www.reallatas.com.br/foto_funcionarios/${cpf}.jpg`
})

export default {
    state,
}