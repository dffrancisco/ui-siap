import { reactive } from "vue";
import utils from "@/ts/utils";
import { iDadosDaDevolucao, iDadosDoCaixa, iCaixa } from "./interfaces";
import Swal from "sweetalert2";
import devolucaoManualCaixaService from "./services/devolucaoManualCaixa.service";

export const state = reactive({
  abreDetalhesCaixa: false,
  dadosDoCaixa: [] as iDadosDoCaixa[],
  idDevolucao: "",
  dadosDaDevolucao: <iDadosDaDevolucao> {} ,
  loading: false,
  caixaSelecionado: <iCaixa>{} ,
});

export const actions = {
  async init() {
    state.dadosDoCaixa = await devolucaoManualCaixaService.getCaixasDoDia()
    
  },

  async getDadosDaDevolucao(codigoDevolucao) {
    if (!state.idDevolucao || state.idDevolucao.length !== 5) {
      Swal.fire({
        icon:  "warning",
        title: "código de devolução inválida",
        text:  "certifique-se de que o campo não está em branco.",
      });
      return
    }
      try {
        state.dadosDaDevolucao = await devolucaoManualCaixaService.getDadosDaDevolucao(codigoDevolucao)
        return alert('dados encontrados')
      } catch {
        alert('dados não encontrados')
      }
  },

  abreModal(caixa:iCaixa){
    state.idDevolucao = ''
    state.dadosDaDevolucao = <iDadosDaDevolucao> {}
    state.abreDetalhesCaixa = true
    state.caixaSelecionado = caixa    
  },

  fechaModal(){
    state.abreDetalhesCaixa = false;
    state.idDevolucao = ''
    state.dadosDaDevolucao = <iDadosDaDevolucao> {}

  }

      // onClickConfirmaDesbloqueio() {
      //     utils.confirmaCodigo({
      //         msg: `Deseja liberar o crédito ${}?`,
      //         theme: "xModal-bublue",
      //         call: async () => {
      //             try {
      //                 state.loading = true;
      //                 Swal.fire({
      //                     icon: "success",
      //                     title: "Crédito desbloqueado",
      //                 });
      //                 state.= "";
      //                 state. = {};
      //             } catch (error) {
  
      //                 Swal.fire({
      //                     icon: "error",
      //                     title: "Erro ao processar sua solicitação.",
      //                 });
      //             } finally {
      //                 state.loading = false;
      //             }
      //         },
      //     });
      // },

}