import { reactive } from "vue";
import { iOrcamento } from "./interfaces";
import Swal from "sweetalert2";
import xAuthManager from "@/plugins/xAuthManager";
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
        parseInt(state.numOrcamento)
      );

      if (!orcamento?.NUM_ORCAMENTO) {
        Swal.fire({
          text: "Orçamento não encontrado",
          icon: "warning"
        });
        return;
      }
      const mesmoGrupo = 1;
      if (orcamento.ANO === undefined || orcamento.MES === undefined) {
        Swal.fire({
          text: "Orçamento não é do mês atual",
          icon: "warning"
        });
        return;
      }

      if (orcamento.MESMO_GRUPO !== mesmoGrupo) {
        Swal.fire({
          text: "Orçamento não é do mesmo grupo",
          icon: "warning"
        });
        return;
      }
      const updated = await servicerecalcularDescontoLoja.updateOrcamento({
        NUM_ORCAMENTO: orcamento.NUM_ORCAMENTO
      });

      Swal.fire({
        text: "Orçamento atualizado com sucesso",
        icon: "success"
      });

      state.orcamento = updated;

    } catch (error: any) {
      console.error("Erro em onClickRecalcularDesconto:", error);
      Swal.fire({
        text: error?.response?.data?.msg || "Ocorreu um erro ao processar o orçamento",
        icon: "error"
      });
    } finally {
      state.loading = false;
    }
  }
};






