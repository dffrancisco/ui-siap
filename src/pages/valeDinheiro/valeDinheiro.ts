import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceValeDinheiro from './services/valeDinheiro.service';
import { iValeAPagar, iValeAPagarAlteracao } from "./interface";
import { formatValorUSA } from "@/ts/utils";

export const state = reactive({
  tab: 'valesAPagar',
  loading: false,
  valesAPagar: [],
  valorDisponivel: 0,

})

const getValesAPagar = async () => {
  try {
    state.loading = true;

    const vales = await serviceValeDinheiro.getValesAPagar();

    state.valesAPagar = vales;

  } catch (error) {
    state.valesAPagar = [];
    Swal.fire({
      text: 'Ocorreu um erro ao buscar vales',
      icon: "error"
    })
  } finally {
    state.loading = false;
  }
}

const getValorDisponivelVale = async () => {
  try {
    state.loading = true;

    const dados = await serviceValeDinheiro.getValorDisponivelVale();

    state.valorDisponivel = dados.valorDisponivelVale;
  } catch (error) {
    state.valorDisponivel = 0;
    Swal.fire({
      text: error?.response?.data?.msg || 'Ocorreu um erro ao buscar valor disponível',
      icon: "error"
    })
  } finally {
    state.loading = false;
  }
}

export const negarVale = async (item: iValeAPagar) => {
  try {
    state.loading = true;

    await serviceValeDinheiro.negarVale({
      COD_FUNCIONARIO: item.COD_FUNCIONARIO,
      DATA: item.DATA,
    });
    const vales = await serviceValeDinheiro.getValesAPagar();

    state.valesAPagar = vales;

  } catch (error) {
    state.valesAPagar = [];
    Swal.fire({
      text: 'Ocorreu um erro ao negar vale',
      icon: "error"
    })
  } finally {
    state.loading = false;
  }
}

export const alterarVale = async (item: iValeAPagarAlteracao) => {
  try {
    state.loading = true;

    await serviceValeDinheiro.alterarVale({
      COD_FUNCIONARIO: item.COD_FUNCIONARIO,
      DATA: item.DATA,
      VALOR: formatValorUSA(item.novoValor),
    });

    const vales = await serviceValeDinheiro.getValesAPagar();

    state.valesAPagar = vales;

  } catch (error) {
    state.valesAPagar = [];
    Swal.fire({
      text: 'Ocorreu um erro ao alterar vale',
      icon: "error"
    })
  } finally {
    state.loading = false;
  }
}

export const pagarVale = async (
  funcionarios: iValeAPagarAlteracao[],
  COD_FUNCIONARIO_PAGADOR: number,
) => {
  try {
    state.loading = true;

    await serviceValeDinheiro.pagarVale({
      funcionarios,
      COD_FUNCIONARIO_PAGADOR,
    });

    const vales = await serviceValeDinheiro.getValesAPagar();

    state.valesAPagar = vales;

    await serviceValeDinheiro.getValorDisponivelVale();
    await getValorDisponivelVale();

    Swal.fire({
      icon: 'success',
      text: 'Pagamento confirmado com sucesso!'
    });

  } catch (error) {
    state.valesAPagar = [];
    Swal.fire({
      text: 'Ocorreu um erro ao alterar vale',
      icon: "error"
    })
  } finally {
    state.loading = false;
  }
}

export const init = async () => {
  await getValesAPagar();
  await getValorDisponivelVale();
}

export default {
  state,
}