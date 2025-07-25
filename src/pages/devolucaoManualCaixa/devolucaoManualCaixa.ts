import { reactive } from "vue";
import utils from "@/ts/utils";
import { iDadosDoCaixa } from "./interfaces";
import Swal from "sweetalert2";
import devolucaoManualCaixaService from "./services/devolucaoManualCaixa.service";
import { C } from "@fullcalendar/core/internal-common";

export const state = reactive({
  abreDetalhesCaixa: false,
  dadosDoCaixa: [] as iDadosDoCaixa[],
  pequisaDevolucao: ""
    
});

export const actions = {
    async init() {
      state.dadosDoCaixa = await devolucaoManualCaixaService.getCaixasDoDia()
     
    },

    getDadosDaDevolucao(codigoDevolucao){
     return console.log(codigoDevolucao)
    },


}