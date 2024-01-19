import { reactive } from 'vue';
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from 'sweetalert2';
import { iDrivers, iFieldDuplicity, iParamGetImpressorasTermicas } from './intefaces'

import servicesImpressorasTermicas from './services/services.impressorasTermicas'
import { iImpressorasTermicas } from './intefaces';
import utils from '@/ts/utils';
import { msgConfirm } from '@/ts/message';


interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iImpressorasTermicas
}

export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
    disableSearch: false,
    edtSearch: '',
    dbImpressorasTermicas: <iImpressorasTermicas>{},
    dsDriver: <iDrivers[]>[],
    loading: false
})

const lowerCase = (value: any) => {
    value = value.toLowerCase();

    return value;
    
}

export const actions = {
    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: '#gridPrincipal',
            height: 200,
            count: true,
            columns: {
                'IP': { dataField: 'IP' },
                'Local': { dataField: 'LOCAL' },
                'Carrossel': { dataField: 'CARROSSEL', compare:'xico' },
                'Situação': { dataField: 'STATUS', compare: 'status' },
                'Qtd. Imp.': { dataField: 'QTO_IMP' }
            },
            compare: {
                xico(r) {
                    if(r.CARROSSEL.trim() == 'N')
                    return 'NÃO'
                
                    if(r.CARROSSEL.trim() == 'S')
                    return 'SIM'
            
                    return r.value
                },
                status(r){
                    if(r.STATUS.trim() == 'AT')
                    return 'ATIVA'

                    if(r.STATUS.trim() == 'IN')
                    return 'INATIVA'

                    return r.value
                }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getImpressorasTermicas(rs)

                    state.gridPrincipal.querySourceAdd(data)
                }

                
            },
            sideBySide: {
                el: '#pnCampos',
                vModel(r) { state.dbImpressorasTermicas = r },
                // compare:{
                //     // LOCAL(r){
                //     //     console.log(r);
                        
                //     // }
                // },
                duplicity: {
                    dataField: ['IP'],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field
                        });

                        console.log(dup)

                        if (Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + ' já cadastrado'
                            )
                            return true
                        }
                        return false
                    },
                },
                frame: {
                    el: '#pnBotoes',
                    buttons: {
                        novo: {
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
                        excluir: {
                            html: "Excluir",
                            state: "delete",
                            click: actions.btnDelete,
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
                        },
                    }
                }
            },
        })
    },

    btnInsert() {
        state.disableSearch = true;
        state.gridPrincipal.focusField();
        state.gridPrincipal.clearElementSideBySide()

    },

    btnEdit() {
        state.disableSearch = true;
        console.log('Editar');

    },

    async btnDelete() {
        //@ts-ignore
        if(state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: 'info',
                text: 'Nenhum registro selecionado para alteração, operação cancelada!'
            })
            return false
        }
        if(await msgConfirm("Confirmação", "Confirma exclusão deste registro?"))
        await actions.toDelete();
        state.gridPrincipal.focus();
    },

    async btnSave() {

        if (utils.validaOBR()) return false;

        if (await state.gridPrincipal.getDuplicityAll() == true) return false;

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            actions.toInsert();
        } else {
            actions.toUpdate();
        }

        state.gridPrincipal.enable();
        state.disableSearch = false;
        state.gridPrincipal.focus();
    },

    btnCancel() {
        console.log('Cancelar');
        state.disableSearch = false;
        console.log(state.disableSearch)
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();

    },

    async getImpressorasTermicas({ offset, param }: iParamGetImpressorasTermicas) {
        try {
            state.loading = true;
            let data = await servicesImpressorasTermicas.getImpressorasTermicas({ offset, param })

            state.loading = false

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir impressoras!'
            })
        }
    },

    search() {
        state.gridPrincipal.queryOpen({
            IP: state.edtSearch.toUpperCase(),
            LOCAL: state.edtSearch.toUpperCase()
        })
    },

    async getDrivers() {
        try {
            let data = await servicesImpressorasTermicas.getDrivers();

            state.dsDriver = data


            console.log('dsDriver', data);


            //aqui eu monto o array com as mascaras dos nomes e armazeno ele em um state para fazer o v-for

            return data
        } catch (error) {
            Swal.fire({ icon: 'error', text: 'Erro ao carregar modelos!' })
        }
    },

    async getDuplicidade({ field, value }: iFieldDuplicity) {
        try {
            let data = servicesImpressorasTermicas.getDuplicidade({ field, value });

            return data;
        } catch (error) {
            Swal.fire({ icon: 'error', text: ' Impressora já cadastrada!' })
        }
    },

    async toInsert() {

        try {
            let newFilds = (
                state.gridPrincipal.getElementSideBySideJson(true, false)
            )
            console.log('newFilds', newFilds)        
            
            state.loading = true
            let data = servicesImpressorasTermicas.toInsert(newFilds)
            state.loading = false
            console.log('data', data);

            state.gridPrincipal.insertLine({ ...newFilds, ...data })

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir corredor!",
            });
        }
    },

    async toDelete() {
        try{
            let id_impressora = state.dbImpressorasTermicas.ID_IMPRESSORA

            state.loading = true
            await servicesImpressorasTermicas.toDelete(id_impressora)
            state.loading = false

            state.gridPrincipal.deleteLine();
        }catch(error){
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir Impressora! talves ela esteja sendo utilizada em outro local"
            });
        }
    },

    async toUpdate() {
        try{
            let alterarImpressora = state.gridPrincipal.getDiffTwoJson(true, false)
            let dadosAlterados = {
                ...state.dbImpressorasTermicas,
                ...alterarImpressora.new
            }

            await servicesImpressorasTermicas.toUpdate(dadosAlterados)

            state.dbImpressorasTermicas = {... state.dbImpressorasTermicas, ...alterarImpressora } as iImpressorasTermicas;
            state.gridPrincipal.dataSource(dadosAlterados)
        }catch(error){
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao atualizar corredor!'
            })
        }
    }

}

export default { state, actions }