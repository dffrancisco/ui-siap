import { reactive } from "vue";
import { iOrcamento } from "./interfaces";
import Swal from "sweetalert2";
import servicerecalcularDescontoLoja from "./services/recalcularDescontoLoja.service";

export const state = reactive({
  loading: false,
  orcamento: <iOrcamento>{},
  numOrcamento: '',


})

export const actions = {
  async onClickRecalcularDesconto() {
    try {
      state.loading = true;
      const orcamento = await servicerecalcularDescontoLoja.getOrcamento(
        parseInt(state.numOrcamento));

      if (orcamento.msg !== 'sucess') {
        Swal.fire({
          text: orcamento.msg,
          icon: "error",
        });
        return;
      }

      const update = await servicerecalcularDescontoLoja.updateOrcamento({
        NUM_ORCAMENTO: orcamento.NUM_ORCAMENTO
      });
      console.log(orcamento.msg);
      Swal.fire({
        text: update.msg,
        icon: "success"
      });

      state.orcamento = update;

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






