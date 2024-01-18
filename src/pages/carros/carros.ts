import { reactive } from 'vue'
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from 'sweetalert2';
import { msgConfirm } from '@/ts/message';
import { iCarro, iMontadora, iParamGetCarros, iFieldDuplicity } from './interfaces'
import serviceCarros from "./services/carros.service";
import utils from '@/ts/utils';

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iCarro
}

export const state = reactive(({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    listaMontadoras: <iMontadora[]>[],
    edtSearch: <HTMLInputElement>{},
    dbCarro: <iCarro>{},
    loading: false
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
                    let data = await actions.getCarros({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridPrincipal.querySourceAdd(data)
                }
            },

            sideBySide: {
                el: '#pnCampos',
                vModel(r) { state.dbCarro = r },
                duplicity: {
                    dataField: ['DESCRICAO'],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });

                        if (Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + ' já está cadastrada'
                            );
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

    async getCarros({ param, offset }: iParamGetCarros) {
        try {
            state.loading = true
            const data = await serviceCarros.getCarros({ param, offset });
            state.loading = false

            return data;
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os carros!"
            });
        }
    },

    search() {
        state.gridPrincipal.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase()
        });
    },

    encontrarMontadoras(ID_MONTADORA) {
        const montadoraEncontrada = state.listaMontadoras.find(montadora => {
            if ((montadora.ID_MONTADORA == ID_MONTADORA)) {
                return true;
            }

            return false;
        })

        let montadora = montadoraEncontrada.DESCRICAO

        return montadora
    },

    async getMontadoras() {
        try {
            const data = await serviceCarros.getMontadoras();
            state.listaMontadoras = data;
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as montadoras!"
            });
        }
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceCarros.getDuplicidade({ value, field });

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Carro já cadastrado!"
            });
        }
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
        try {
            let id_carro = state.dbCarro.ID_CARRO

            state.loading = true
            await serviceCarros.toDelete(id_carro);
            state.loading = false
            state.gridPrincipal.deleteLine();
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir o carro! Talvez ele esteja sendo utilizado em outro local.",
            });
        }
    },

    async toInsert() {
        try {
            let newFields = <any>(
                state.gridPrincipal.getElementSideBySideJson(true, false)
            );

            state.loading = true;
            await serviceCarros.toInsert(newFields)
            state.loading = false;

            let montadora = actions.encontrarMontadoras(newFields.ID_MONTADORA)
            state.gridPrincipal.insertLine({
                ...newFields,
                MONTADORA: montadora
            });

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir carro!",
            });
        }
    },

    async toUpdate() {
        try {
            let dadosDiff = state.gridPrincipal.getDiffTwoJson(true, false);

            if (dadosDiff.diff == false) {
                return
            }

            let dadosAtualizados = {
                ...state.dbCarro,
                ...dadosDiff.new
            }

            state.loading = true
            await serviceCarros.toUpdate(dadosAtualizados)
            state.loading = false

            state.dbCarro = dadosAtualizados as iCarro;

            let montadora = actions.encontrarMontadoras(dadosAtualizados.ID_MONTADORA)
            state.gridPrincipal.dataSource({
                ...dadosAtualizados,
                MONTADORA: montadora
            })

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao atualizar carro!",
            });
        }
    }
}

export default { state, actions }