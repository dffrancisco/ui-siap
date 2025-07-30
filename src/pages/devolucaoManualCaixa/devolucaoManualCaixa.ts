import { reactive } from "vue";
import utils from "@/ts/utils";
import { iDadosDaDevolucao, iDadosDoCaixa, iCaixa } from "./interfaces";
import Swal from "sweetalert2";
import devolucaoManualCaixaService from "./services/devolucaoManualCaixa.service";

export const state = reactive({
  dadosDaDevolucao: <iDadosDaDevolucao>{},
  dadosDoCaixa: [] as iDadosDoCaixa[],
  caixaSelecionado: <iCaixa>{},
  idDevolucao: "",
  abreDetalhesCaixa: false,
  loading: false,
  devolucao: ""
});

export const actions = {
  async init() {
    state.dadosDoCaixa = await devolucaoManualCaixaService.getCaixasDoDia()

  },

  async getDadosDaDevolucao(codigoDevolucao) {
    if (!state.idDevolucao || state.idDevolucao.length !== 5) {
      Swal.fire({
        icon: "warning",
        title: "código de devolução inválida",
        text: "certifique-se de que o campo não está em branco.",
      });
      return
    }
    try {
      state.loading = true
      state.dadosDaDevolucao = await devolucaoManualCaixaService.getDadosDaDevolucao(codigoDevolucao)
      state.devolucao = state.idDevolucao;
      state.loading = false
      return
    } catch {
      Swal.fire({
        icon: "error",
        title: "devolução não bloqueada",

      });
      state.loading = false

    }
  },

  abreModal(caixa: iCaixa) {
    state.devolucao = ''
    state.idDevolucao = ""
    state.dadosDaDevolucao = <iDadosDaDevolucao>{}
    state.abreDetalhesCaixa = true
    state.caixaSelecionado = caixa
  },

  fechaModal() {
    state.abreDetalhesCaixa = false;
    state.devolucao = ''
    state.dadosDaDevolucao = <iDadosDaDevolucao>{}
    state.idDevolucao = ""

  },

  // trabalhando essa parte

  async onClickLancamento(idDevolucao: string) {
    const idDevolucaoSql = idDevolucao
    const codCaixa = state.caixaSelecionado.COD_FUNCIONARIO
    const idAberturaCaixa =   state.caixaSelecionado.ID_ABERTURA_CAIXA
    const caixa = state.caixaSelecionado.USUARIO
    
    console.log(codCaixa, idAberturaCaixa, idDevolucaoSql, caixa)

    state.abreDetalhesCaixa = false
    utils.confirmaCodigo({
      
      msg: `Deseja lançar a devolução ${state.devolucao} no valor de 
      ${utils.formatValor(state.dadosDaDevolucao.VALOR)} no caixa de ${state.caixaSelecionado.USUARIO}?`,
      theme: "xModal-bublue",
      call: async () => {
              try {
                state.loading = true;
                await devolucaoManualCaixaService.onClickLancamento(codCaixa, idAberturaCaixa, idDevolucaoSql, caixa)
                  Swal.fire({
                      icon: "success",
                      title: "Crédito desbloqueado",
                  });

              } catch (error) {

                  Swal.fire({
                      icon: "error",
                      title: "Erro ao processar sua solicitação.",
                  });
              } finally {
                  state.loading = false;
              }
          },
      });
  },

}