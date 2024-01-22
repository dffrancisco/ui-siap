import $ from 'jquery'
import axios from 'axios';
import { reactive } from 'vue'
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from 'sweetalert2';
const caminho = "siap/carros"
import globalState from '@/store/globalState'
import { msgConfirm } from '@/ts/message';
import utils from '@/ts/utils';

interface iCarro {
    DESCRICAO: string;
    ID_CARRO: number;
    ID_MONTADORA: number;
    MONTADORA: string;
}

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iCarro
}

export const state = reactive(({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    dsMontadoras: <{ ID_MONTADORA: number, DESCRICAO: string }[]>{},
    edtSearch: <HTMLInputElement>{},
    dbCarro: <iCarro>{},
}))


export const actions = {

    grids() {

        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                'Descrição': { dataField: 'DESCRICAO' },
                'Montadora': { dataField: 'MONTADORA' }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getCarros(rs)
                    state.gridPrincipal.querySourceAdd(data)
                }
            },

            sideBySide: {
                el: '#pnCampos',
                vModel(r) { state.dbCarro = r },
                duplicity: {
                    dataField: ['DESCRICAO'],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade(rs.value.toUpperCase(), rs.field)

                        if (Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(rs.text + ' já está cadastrada')
                            return true;
                        }

                        return false
                    }
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
                        salvar: {
                            html: 'Salvar',
                            state: 'save',
                            click: actions.btnSave,
                            preLoad: 'Salvando',
                        },
                        excluir: {
                            html: 'Excluir',
                            state: 'delete',
                            click: actions.btnDelete
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

    async getCarros(param: any) {

        let { data } = await axios.post(caminho, {
            call: 'getCarros',
            param
        })
        return data;
    },

    search() {
        state.gridPrincipal.queryOpen({ DESCRICAO: state.edtSearch.value.toUpperCase() });
    },

    async getMontadoras() {
        let { data } = await axios.post(caminho, {
            call: 'getMontadoras'
        })

        state.dsMontadoras = data
    },

    async getDuplicidade(value: string, field: string) {

        let { data } = await axios.post(caminho, {
            call: 'getDuplicidade',
            value,
            field
        })

        return data
    },

    btnInsert() {

        state.pnSearch = true

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField()
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit() {

        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: 'info',
                text: 'Nenhum registro selecionado para alteração, operação cancelada!'
            })
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {

        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: 'info',
                text: 'Nenhum registro selecionado para alteração, operação cancelada!'
            })
            return false;
        }

        if (await msgConfirm("Confirmação", "Confirma exclusão deste registro?")) {
            await actions.toDelete()
            state.gridPrincipal.focus();
        }


    },

    async btnSave() {


        if (utils.validaOBR())
            return false

        if (await state.gridPrincipal.getDuplicityAll())
            return false;

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false)
            actions.toInsert();
        else {
            actions.toUpdate();
        }

        state.gridPrincipal.enable();

        state.pnSearch = false
        state.gridPrincipal.focus();
    },

    btnCancel() {

        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async toDelete() {

        let { data } = await axios.post(caminho, {
            call: 'delete',
            id_carro: state.gridPrincipal.dataSource().ID_CARRO
        })

        if (data.error) {
            await Swal.fire({
                icon: 'error',
                text: data.msg
            })
            return false
        }

        state.gridPrincipal.deleteLine()

    },

    async toInsert() {
        let newFields = <any>state.gridPrincipal.getElementSideBySideJson(true, false)

        let { data } = await axios.post(caminho, {
            call: 'insert',
            param: newFields
        })

        if (data.error) {
            Swal.fire({
                icon: 'error',
                text: data.msg
            })
            return false
        }

        newFields['ID_CARRO'] = data.id_carro
        newFields['MONTADORA'] = $('#ID_MONTADORA option:selected').text();

        // console.log(newFields);

        state.gridPrincipal.insertLine(newFields);

    },

    async toUpdate() {
        let diff = state.gridPrincipal.getDiffTwoJson(true, false);

        if (diff.diff) {

            delete diff.diff;

            let { data } = await axios.post(caminho, {
                call: 'update',
                id_carro: state.gridPrincipal.dataSource().ID_CARRO,
                diff
            })


            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    text: data.msg
                })
                return false
            }


            diff.new['MONTADORA'] = $('#ID_MONTADORA option:selected').text();
            state.gridPrincipal.dataSource(diff.new)

        }

    }
}


export default { state, actions }