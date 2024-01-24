import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { iFieldDuplicity, iGruposMarcas, iMarcas, iParamGetMarcas } from "./interfaces";
import { reactive } from "vue";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message"
import serviceMarcas from './services/marca.services'
import utils from "@/ts/utils";

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iMarcas
}

export const state = reactive({
    dbMarca: <iMarcas>{},
    dsMarca: <iGruposMarcas[]>[],
    loading: false,
    disabledSearch: false,
    edtSearch: <HTMLInputElement>{},
    gridPrincipal: <_ixGridCreate>{}
})

export const actions = {
    criarGrids() {
        state.gridPrincipal = new xGridV2.create({
            el: '#gridPrincipal',
            height: 200,
            count: true,
            columns: {
                'Descriçao': { dataField: 'DESCRICAO'},
                'Grupo Marca': { dataField: 'GRUPO'},
            },
            query:{
                async execute(rs) {
                    let data = await actions.getMarcas(rs);
                    state.gridPrincipal.querySourceAdd(data);
                }
            },
            sideBySide: {
                el: '#pnCampos',
                vModel(r) {state.dbMarca = r},
                duplicity:{
                    dataField:['DESCRICAO'],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field
                        });

                        if(Object.keys(dup).length > 0){
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + ' já cadastrado'
                            )
                            return true;
                        }
                        return false;
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
                            html: 'Excluir',
                            state: 'delete',
                            click: actions.btnDelete
                        },
                        salvar: {
                            html: 'Salvar',
                            state: 'save',
                            click: actions.btnSave,
                            preLoad: 'Salvando',
                        },
                       
                        cancela: {
                            html: 'Cancelar',
                            state: 'cancel',
                            click: actions.btnCancel
                        }
                    }

                }
            },
            enter: function () {
                document.getElementById('btnUpdate').click()
            }
        });

    },
    init() {
        state.loading = true
        actions.criarGrids()
        actions.getGrupoMarcas();

        state.gridPrincipal.queryOpen({ GRUPO: ''})
        state.gridPrincipal.focus()
        state.loading = false
    },

    btnInsert() {
        state.disabledSearch = true;
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
        state.gridPrincipal.clearElementSideBySide();
    },

    async btnSave(){

        if (utils.validaOBR()) return false;

        if(await state.gridPrincipal.getDuplicityAll() == true) return false;

        let selectedOption = state.dsMarca.find(group => group.GRUPO === state.dbMarca.GRUPO);
        let idMarcaGrupo = selectedOption ? selectedOption.ID_MARCA_GRUPO : null;

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false){
            actions.toInsert(idMarcaGrupo);
        }else{
            actions.toUpdate(idMarcaGrupo);
        }

        state.disabledSearch = false
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
        
    },

    btnEdit(){ 
        //@ts-ignore
        if(state.gridPrincipal.dataSource() == false) {
            Swal.fire({icon: 'info', text: 'Nenhum registro selecionado para alteração, operação cancelada!'})
            return false
        }
        state.disabledSearch = true
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
        
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

    btnCancel(){
        state.disabledSearch = false
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
        
    },

    async getMarcas({offset, param}: iParamGetMarcas) {
        try{
            state.loading = true
            let data = await serviceMarcas.getMarcas({offset, param})            
            state.loading = false            

            return data
        }catch(error){
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir marcas'
            })
        }
    },

    async getGrupoMarcas() {
        try{
            let data = await serviceMarcas.getGrupoMarcas()            
            
            state.dsMarca = data            

            return data
        }catch(error){
            Swal.fire({
                icon: 'error',
                text: 'Erro ao carregador grupo de marcas'
            })
        }
    },

    search() {
        state.gridPrincipal.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase(),
        });
    },

    async toInsert(idMarcaGrupo: any) {
        try{
            
            let newFields: any = (
                state.gridPrincipal.getElementSideBySideJson(true, false)
            );    
            
            state.loading = true;
            let data: any = await serviceMarcas.toInsert(newFields, idMarcaGrupo)
            state.loading = false;   

            state.gridPrincipal.insertLine({...newFields, ...data})
        }catch(error){
            
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inserir marcas'
            })
        }
    },

    async getDuplicidade({ field, value }:iFieldDuplicity){
        try{
            let data = await serviceMarcas.getDuplicidade({field, value});

            return data
        }catch(error){
            Swal.fire({
                icon: 'error',
                text: 'Marca ja cadastrada!'
            })
        }
    },

    async toDelete() {
        try{
            let id_marca = state.dbMarca.ID_MARCA

            state.loading = true
            await serviceMarcas.toDelete(id_marca)
            state.loading = false

            state.gridPrincipal.deleteLine();
        }catch(error){
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir Marca!"
            });
        }
    },

    async toUpdate(idMarcaGrupo: any) {

        try{
            let diff = state.gridPrincipal.getDiffTwoJson(true, false)
            let dadosAlterados = {
                ...state.dbMarca,
                ...diff.new
            }

            dadosAlterados['ID_MARCA_GRUPO'] = idMarcaGrupo;
            
            state.loading = true
            await serviceMarcas.toUpdate(dadosAlterados)
            state.loading = false

            state.dbMarca = { ...state.dbMarca, ...diff} as iMarcas;
            state.gridPrincipal.dataSource(dadosAlterados)

        }catch(error){
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao atualizar corredor!'
            })
            
        }
    },

}