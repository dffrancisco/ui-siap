import utils from '@/ts/utils';
import Swal from "sweetalert2";
import { computed, reactive } from "vue";

import {

} from './interfaces'
import desbloqueioCreditoService from './services/desbloqueioCredito.service';
import { param } from 'jquery';


export const state = reactive({
    listaDadosCredito: [],
    pesquisaCredito:""
    

});

export const actions = {
    async init() {

    },

    async getEnviaChave(param: String) {
        state.listaDadosCredito = await desbloqueioCreditoService.getEnviaChave(param as any);  
    },

}





