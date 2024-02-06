import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import serviceCargos from './services/cargos.service';
import { iCargo, iParamGetCargo } from './interfaces';
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
            enter: function () {
                document.getElementById('btnUpdate').click()
            },
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
                    buttons: {
                        novo: {
                            html: 'Novo',
                            state: 'insert',
                            click: actions.btnInsert
                        },
                        atualizar: {
                            html: 'Alterar',
                            state: 'update',
                            click: actions.btnEdit
                        },
                        excluir: {
                            html: 'Inativar',
                            state: 'delete',
                            click: actions.btnDelete
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
            }

        })
    },

    init() {
        actions.criarGrids()

        state.edtSearch = <any>document.getElementById("edtSearch");

        state.gridCargos.queryOpen({ DESCRICAO: "" }, () => {
            state.gridCargos.focus();
        });
    },

    btnInsert() {
        state.pnSearch = true
        state.toggleDisabled = true

        state.gridCargos.disable();
        state.gridCargos.focusField()
        state.gridCargos.clearElementSideBySide();
    },

    btnEdit() {

        if (!state.gridCargos.dataSource()) {
            Swal.fire({
                icon: 'warning',
                text: 'Nenhum registro selecionado para alteração, operação cancelada!'
            })
            return false;
        }

        state.pnSearch = true
        state.toggleDisabled = true
        state.gridCargos.disable();
        state.gridCargos.focusField();
    },

    async btnDelete() {

        if (!state.gridCargos.dataSource()) {
            Swal.fire({
                icon: 'warning',
                text: 'Nenhum registro selecionado para alteração, operação cancelada!'
            })
            return false;
        }

        if (state.isChecked) {
            if (await msgConfirm("Confirmação", "Confirma a reativação deste cargo?")) {
                await actions.inativarCargo()
                state.gridCargos.focus();
            }
        } else {
            if (await msgConfirm("Confirmação", "Confirma inativação deste registro?")) {
                await actions.inativarCargo()
                state.gridCargos.focus();
            }
        }
    },

    async btnSave() {

        if (utils.validaOBR()) {
            return false
        }

        // if (await state.gridCargos.getDuplicityAll())
        //     return false;

        if (!state.gridCargos.dataSource())
            actions.adicionarCargo();
        else {
            actions.alterarCargo();
        }

        state.gridCargos.enable();

        state.pnSearch = false
        state.toggleDisabled = false
        state.gridCargos.focus();
    },

    btnCancel() {

        state.toggleDisabled = false
        state.pnSearch = false;
        state.gridCargos.enable();

        if (!state.gridCargos.dataSource()) {
            state.gridCargos.queryOpen({ DESCRICAO: "" }, () => {
                state.gridCargos.focus();
            });
        }
    },

    checkboxClicked() {
        state.isChecked = !state.isChecked
        state.edtSearch.value = null

        if (state.isChecked) {
            document.querySelector('button[state="delete"]').textContent = 'Reativar';
        } else {
            document.querySelector('button[state="delete"]').textContent = 'Inativar';
        }

        state.gridCargos.queryOpen({ DESCRICAO: "" }, () => {
            state.gridCargos.focus();
        });
    },

    searchCargos() {
        state.gridCargos.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase(),
        });
    },

    async getCargos({ offset, param, checkbox }: iParamGetCargo) {
        try {
            state.loading = true
            
            const data = await serviceCargos.getCargos({ offset, param, checkbox })

            state.loading = false

            return data
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir os cargos!'
            })
        }
    },

    async adicionarCargo() {
        try {
            let newFields = <any>(
                state.gridCargos.getElementSideBySideJson(true, false)
            );

            state.loading = true

            const data = await serviceCargos.adicionarCargo(newFields)

            state.gridCargos.insertLine({
                ...newFields,
                ID_CARGO: data.ID_CARGO
            })

            state.loading = false

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inserir o cargo!'
            })
        }
    },

    async alterarCargo() {
        try {
            let dadosDiff = state.gridCargos.getDiffTwoJson(true, false)

            if (dadosDiff.diff == false) {
                return
            }

            let salario = <any>state.cargo.SALARIO

            let param = {
                ...state.cargo,
                SALARIO: utils.formatValorUSA(salario),
                ...dadosDiff.new
            }

            state.loading = true

            await serviceCargos.alterarCargo(param)

            state.gridCargos.dataSource({
                ...param
            })

            state.cargo = param as iCargo;
            state.cargo.SALARIO = param.SALARIO * 100;

            state.loading = false

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao alterar o cargo!'
            })
        }
    }
}
