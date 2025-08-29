import { reactive } from "vue";
import Swal from "sweetalert2";
import servicerecalcularDescontoLoja from "./services/recalcularDescontoLoja.service";
import toast from '@/plugins/toast/toast';

export const state = reactive({
  loading: false,
  numOrcamento: null as number | null,
})

export const actions = {
  async onClickRecalcularDesconto() {
    try {
      if (!state.numOrcamento) {
        toast.error("Número do orçamento é obrigatório");
        return
      }
      state.loading = true;
      await servicerecalcularDescontoLoja.getOrcamento(
        state.numOrcamento
      );

      const update = await servicerecalcularDescontoLoja.updateOrcamento({
        NUM_ORCAMENTO: state.numOrcamento
      });

      Swal.fire({
        text: update.msg,
        icon: "success"
      });
      state.numOrcamento = null;
    } catch (error: any) {
      Swal.fire({
        text: error?.response?.data?.msg || "Ocorreu um erro ao processar o orçamento",
        icon: "error"
      });
    } finally {
      state.loading = false;
    }
  }
};






