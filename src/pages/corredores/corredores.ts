import $ from 'jquery'
import  { reactive } from 'vue';
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from 'sweetalert2';
import globalState from '@/store/globalState'
import { iCorredor, iLocalidade, iParamGetCorredores } from './interfaces';

import serviceCorredores from './services/corredores.services'
import utils from '@/ts/utils';


interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iCorredor
}

export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    dsLocalidades: <iLocalidade[]>[],
    edtSearch: <HTMLInputElement>{},
    dbCorredor: <iCorredor>{},
    loading: false
})

export const actions = {
    grids() {
            state.gridPrincipal = new xGridV2.create({
                el: '#gridPrincipal',
                height: 200,
                count: true,
                columns: {
                    'Descrição': { dataField: 'DESCRICAO'},
                    'Localidade': {dataField: 'LOCALIDADE'}
            },
            query: {
                async execute(rs) {
                    let data = await actions.getCorredores(rs)
                    state.gridPrincipal.querySourceAdd(data)
                }
            },
            sideBySide: {
                el: '#pnCampos',
                vModel(r){ state.dbCorredor = r },
                //evitar duplicidade
                duplicity: {
                    dataField: ['DESCRICAO'],
                    // async execute(rs) {
                    //     // let dup = await actions.getDuplicidade(rs.value.toUpperCase(), rs.field)

                    //     if (Object.keys(dup).length > 0) {
                    //         state.gridPrincipal.showMessageDuplicity(rs.text + 'Já está cadastrada')
                    //     }
                    // }
                },
                frame: {
                    el: '#pnBotoes',
                    buttons: {
                        novo:{
                            html: 'Novo',
                            state: 'insert',
                            click: actions.btnInsert 
                        },
                        update: {
                            html: 'Alterar',
                            state: 'update',
                            click: actions.btnEdit,
                            id: 'btnUpdate'
                        },
                        salvar: {
                            html: 'Salvar',
                            state: 'save',
                            click: actions.btnSave,
                            preLoad: 'Salvando'
                        },
                        cancela: {
                            html: 'Cancelar',
                            state: 'cancel',
                            click: actions.btnCancel
                        }
                    }
                }
            },
        })
    },

    async getCorredores({ offset, param }: iParamGetCorredores) {
        try {
            state.loading = true;
            const data = await serviceCorredores.getCorredores({ offset, param })

            state.loading = false
            return data
        }catch(error) {
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir corredores!'
            })
        }
    },

    search(){
        state.gridPrincipal.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase()
        })
    },

    async getLocalidades() {
        try{
            const data = serviceCorredores.getLocalidades();

            return data;
        }catch (error){
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as localidades'
            })
        }
    },
    
    async toInsert() {
        console.log('salvando');
        
        try{
            let newFields = <any>(
                state.gridPrincipal.getElementSideBySideJson(true, false)
            )

            state.loading = true
            await serviceCorredores.toInsert(newFields)
            state.loading = false

            state.gridPrincipal.insertLine(newFields)

        }catch(error){
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inserir corredor!'
            })
        }
    },

    btnInsert() {
        state.pnSearch = true

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField()
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit(){
    },

    async btnSave(){ 
        if(utils.validaOBR()) return false;

        if (await state.gridPrincipal.getDuplicityAll()) return false;

        //@ts-ignore
        if(state.gridPrincipal.dataSource == false) {
            actions.toInsert();
        }
        else{
            return 'irei fazer'
        }
    },

    btnCancel(){
    }

}

export default { state, actions }