import Swal from "sweetalert2";
import { reactive } from "vue";
import utils from "@/ts/utils";
import desbloqueioCreditoService from "../desbloqueioCredito/services/desbloqueioCredito.service";
import devolucaoManualCaixaService from "./services/devolucaoManualCaixa.service";

export const state = reactive({
    abreDetalhesCaixa: false,
    caixas:[]
});

export const actions = {
    async init() {
       await devolucaoManualCaixaService.getCaixasDoDia()
    },


}