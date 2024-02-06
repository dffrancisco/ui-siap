import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import serviceCargos from './services/cargos.service';
import {iCargo, iParamGetCargo} from './interfaces';
import utils from "@/ts/utils";

export const state = reactive({
    gridCargos: <ixGridCreate>{},
    cargo: <iCargo>{},

    pnSearch: false,
    edtSearch: <HTMLInputElement>{},

    isChecked: false,
    toggleDisabled: false,
    loading: false,

    configVMoney: {
        thousands: ".",
        decimal: ",",
        precision: 2,
      },
})

export const actions = {
    criarGrids() {
        state.gridCargos = new xGridV2.create({
            el: '#gridCargos',
            height: 350,
            count: true,
            columns: {
                DESCRICAO: { dataField: 'DESCRICAO', width: "80%" },
                SALARIO: { dataField: 'SALARIO', render: utils.formatValor },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getCargos({
                        offset: rs.offset,
                        param: rs.param,
                        checkbox: state.isChecked
                    })
                    state.gridCargos.querySourceAdd(data);
                }
            },
            sideBySide: {
                el: "#camposGridCargos",
                vModel(r) {
                    r.SALARIO = r.SALARIO * 100 
                    state.cargo = r 
                },
                frame: {
                    el: "#btnGridCargos",
                }
            }
            
        })
    },

    init() {
        actions.criarGrids()

        state.edtSearch = <any>document.getElementById("edtSearch");

        state.gridCargos.queryOpen({
            DESCRICAO: "",
        })
    },

    checkboxClicked() {
        state.isChecked = !state.isChecked
        state.edtSearch.value = null
        state.gridCargos.queryOpen({
            DESCRICAO: "",
        })
    },

    searchCargos() {
        state.gridCargos.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase(),
        });
    },

    async getCargos({offset, param, checkbox}: iParamGetCargo) {
        try {
            state.loading = true
            const data = await serviceCargos.getCargos({ offset, param, checkbox })
            state.loading = false

            return data
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir cargos!'
            })
        }
    } 
}
