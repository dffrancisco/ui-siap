import  { reactive } from 'vue';
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from 'sweetalert2';
import { iCorredor, iFieldDuplicity, iLocalidade, iParamGetCorredores } from './interfaces';
import { msgConfirm } from "@/ts/message";

import serviceCorredores from './services/corredores.services'
import utils from '@/ts/utils';


interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iCorredor
}

export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
    disableSearch: false,
    dsLocalidades: <iLocalidade[]>[],
    edtSearch: '',
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
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });

                        if(Object.keys(dup).length > 0){
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + ' já está cadastrada'
                            );
                            return true
                        }

                        return false
                    },
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
        state.disableSearch = true
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField()
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit() {
        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado para alteração, operação cancelada!",
            });
            return false;
        }
        state.disableSearch = true
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {
         //@ts-ignore
         if (state.gridPrincipal.dataSource() === false) {
          Swal.fire({
              icon: "info",
              text: "Nenhum registro selecionado para alteração, operação cancelada!",
          });
          return false;
      }
  
      if (await msgConfirm("Confirmação", "Confirma exclusão deste registro?")) {
          await actions.toDelete();
          state.gridPrincipal.focus();
      }
    },

    async btnSave() {
        if (utils.validaOBR()) return false;

        if (await state.gridPrincipal.getDuplicityAll() == true) return false;

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            actions.toInsert();
        }
        else {
            actions.toUpdate();            
        }

        state.gridPrincipal.enable();
        state.disableSearch = false;
        state.gridPrincipal.focus();
    },

    btnCancel(){ 
        state.disableSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async getCorredores({ offset, param }: iParamGetCorredores) {
        try {
            state.loading = true;
            let data = await serviceCorredores.getCorredores({ offset, param })

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

    search() {
        state.gridPrincipal.queryOpen({
            DESCRICAO: state.edtSearch.toUpperCase(),
        });
    },

    async getLocalidades() {
        try{
            const data = await serviceCorredores.getLocalidades();

            state.dsLocalidades = data;

            return data
        }catch (error){
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as localidades'
            })
        }
    },

    async getDuplicidade({ field, value }: iFieldDuplicity) {
        try {
            const data = serviceCorredores.getDuplicidade({ field, value });

            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Cidade já cadastrada!",
            });
        }
    },
    
    async toInsert() {
        
        try {
            let newFields = (
                state.gridPrincipal.getElementSideBySideJson(true, false)
            )
            


            state.loading = true
            let data = await serviceCorredores.toInsert(newFields);

            state.loading = false
            
            state.gridPrincipal.insertLine({...newFields, ...data})
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir corredor!",
            });
        }
    },

    async toUpdate() {

        try{
            let diff = state.gridPrincipal.getDiffTwoJson(true, false)
            let dadosAlterados = {
                ...state.dbCorredor,
                ...diff.new
            }

            await serviceCorredores.toUpdate(dadosAlterados)

            state.dbCorredor = { ...state.dbCorredor, ...diff} as iCorredor;
            state.gridPrincipal.dataSource(dadosAlterados)

        }catch(error){
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao atualizar corredor!'
            })
            
        }
    },

    async toDelete() {
        try {
            let cod_corredor = state.dbCorredor.ID
            state.loading = true
            await serviceCorredores.toDelete(cod_corredor);
            state.loading = false
            state.gridPrincipal.deleteLine();
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir cidade! Talvez ela esteja sendo utilizada em outro local.",
            });
        }
    },
}

export default { state, actions }