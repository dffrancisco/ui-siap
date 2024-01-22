import { reactive } from 'vue';
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from 'sweetalert2';
import { iDrivers, iFieldDuplicity, iParamGetImpressorasTermicas } from './intefaces'

import servicesImpressorasTermicas from './services/services.impressorasTermicas'
import { iImpressorasTermicas } from './intefaces';
import utils from '@/ts/utils';
import { msgConfirm } from '@/ts/message';
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import { RouteLocationNormalizedLoaded } from 'vue-router';


interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iImpressorasTermicas
}

export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
    disableSearch: false,
    edtSearch: '',
    dbImpressorasTermicas: <iImpressorasTermicas>{},
    dsDriver: <iDrivers[]>[],
    loading: false,
    modalInfoModelo: <iModalCreate>(<unknown>null),
    modalInfoModeloOpened: false
})


export const actions = {
    grids() {
        
        state.gridPrincipal = new xGridV2.create({
            el: '#gridPrincipal',
            height: 200,
            count: true,
            columns: {
                'IP': { dataField: 'IP'},
                'Local': { dataField: 'LOCAL' },
                'Carrossel': { dataField: 'CARROSSEL', compare:'carrossel' },
                'Situação': { dataField: 'STATUS', compare: 'status' },
                'Qtd. Imp.': { dataField: 'QTO_IMP' }
            },
            compare: {
                carrossel(r) {
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
                },
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

    criarModais() {
        state.modalInfoModelo = new xModal.create({
            height: 500,
            width: 500,
            el: '#iInfoModelo',
            onOpen: () => {
                state.modalInfoModeloOpened = true;
            },
            onClose: () => {
                state.modalInfoModeloOpened = false;
            }
        })
    },

    init(route: RouteLocationNormalizedLoaded) {
        state.loading = true;
        actions.criarModais();
        state.loading = false;
    },

    btnInsert() {
        state.disableSearch = true;
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit() {
        state.disableSearch = true;
        state.gridPrincipal.disable();
        console.log('Editar');

    },

    onClickModelo() {
        state.modalInfoModelo.open()
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
        state.disableSearch = false;
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
            let newFields: any = (
                state.gridPrincipal.getElementSideBySideJson(true, false)
            )

            console.log('SOU EU', newFields)            
        
            state.loading = true
            let data: any = await servicesImpressorasTermicas.toInsert(newFields);

            state.loading = false
            
            state.gridPrincipal.insertLine({...newFields, ...data})
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir impressora!",
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

            console.log(dadosAlterados)

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