import $ from 'jquery'
import axios from 'axios';
import { reactive } from 'vue'
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from 'sweetalert2';

import globalState from '@/store/globalState'
import { msgConfirm } from '@/ts/message';

import { iEntregarReceber } from './interfaces';
import utils from '@/ts/utils';



interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iEntregarReceber
}

const caminho = "siap/entregarReceber"

export const state = reactive(({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    edtSearch: <HTMLInputElement>{},
    dbEntReb: <iEntregarReceber>{},
}))


export const actions = {

    grids() {

        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                'Orçamento': { dataField: 'NUM_ORCAMENTO', width: '10%', right: true },
                'Cliente': { dataField: 'NOME' },
                'Vendedor': { dataField: 'LOGIN', width: '15%' },
                'Data': { dataField: 'DATA', width: '12%', center: true, render: utils.dataBrasil },
                'Valor': { dataField: 'VALOR', width: '12%', right: true, render: utils.formatValor },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getEntregarReceberPendente(rs)
                    state.gridPrincipal.querySourceAdd(data)
                }
            },

            // sideBySide: {
            //     el: '#pnCampos',
            //     vModel(r) { state.dbEntReb = r },
            // },
            enter: function () {
                document.getElementById('btnUpdate').click()
            }
        });

    },

    async getEntregarReceberPendente(param: any) {

        let { data } = await axios.post(caminho, {
            call: 'getEntregarReceberPendente',
            param
        })
        return data;
    },

    search() {
        state.gridPrincipal.queryOpen({});
    },


}


export default { state, actions }