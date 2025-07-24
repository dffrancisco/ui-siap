import { reactive } from "vue";
import utils from "@/ts/utils";
import { iDadosDoCaixa } from "./interfaces";
import Swal from "sweetalert2";
import devolucaoManualCaixaService from "./services/devolucaoManualCaixa.service";

export const state = reactive({
    abreDetalhesCaixa: false,
    dadosDoCaixa: [] as iDadosDoCaixa[]
});

export const actions = {
    async init() {
      state.dadosDoCaixa = await devolucaoManualCaixaService.getCaixasDoDia()
     
    },

    getDadosDaDevolucao(){
      
    }

}