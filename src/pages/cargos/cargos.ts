import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import serviceCargos from './services/cargos.service';
import {iCargo} from './interfaces';

export const state = reactive({
    gridCargos: <ixGridCreate>{},
    cargo: <iCargo>{},

    pnSearch: false,
    edtSearch: <HTMLInputElement>{},

    isChecked: false,
    toggleDisabled: false,
    loading: false
})

export const actions = {
    criarGrids() {
        state.gridCargos = new xGridV2.create({
            el: '#gridCargos',
            height: 400,
            columns: {
                DESCRICAO: { dataField: 'DESCRICAO', width: "80%" },
                SALARIO: { dataField: 'SALARIO' },
            },
            query: {
                execute(rs) {
                    
                }
            },
            sideBySide: {
                el: 'camposCargos',
                vModel(r) {state.cargo = r},
            }
        })
    },

    init() {
        actions.criarGrids()
    }
}
