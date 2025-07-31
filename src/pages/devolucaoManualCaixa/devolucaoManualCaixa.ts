import { reactive } from "vue";
import utils from "@/ts/utils";
import { iDadosDevolucao, iDadosCaixa, iCaixa } from "./interfaces";
import Swal from "sweetalert2";
import devolucaoManualCaixaService from "./services/devolucaoManualCaixa.service";

export const state = reactive({
  dadosDevolucao: <iDadosDevolucao>{},
  dadosCaixa: [] as iDadosCaixa[],
  caixaSelecionado: <iCaixa>{},
  idDevolucao: "",
  detalheCaixa: false,
  loading: false,
  devolucao: ""
});

export const actions = {
  async init() {
    state.dadosCaixa = await devolucaoManualCaixaService.getCaixaDiario()

  },

  async getDadosDevolucao(codigoDevolucao) {
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
      state.dadosDevolucao = await devolucaoManualCaixaService.getDadosDevolucao(codigoDevolucao)
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

  abrirModal(caixa: iCaixa) {
    state.devolucao = ''
    state.idDevolucao = ""
    state.dadosDevolucao = <iDadosDevolucao>{}
    state.detalheCaixa = true
    state.caixaSelecionado = caixa

  },

  fecharModal() {
    state.detalheCaixa = false;
    state.devolucao = ''
    state.dadosDevolucao = <iDadosDevolucao>{}
    state.idDevolucao = ""

  },

  async onClickLancamento(idDevolucao: string) {
    const idDevolucaoSql = idDevolucao
    const codCaixa = state.caixaSelecionado.COD_FUNCIONARIO
    const idAberturaCaixa = state.caixaSelecionado.ID_ABERTURA_CAIXA
    const caixa = state.caixaSelecionado.USUARIO

    console.log(codCaixa, idAberturaCaixa, idDevolucaoSql, caixa)

    state.detalheCaixa = false
    utils.confirmaCodigo({

      msg: `Deseja lançar a devolução ${state.devolucao} no valor de 
      ${utils.formatValor(state.dadosDevolucao.VALOR)} no caixa de ${state.caixaSelecionado.USUARIO}?`,
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