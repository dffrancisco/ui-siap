import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import { iCarroCliente, iModelos, iParamGetCarroCliente, iFieldDuplicity } from "./interfaces";
import serviceCarroCliente from "./service/carro_cliente.service";

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iCarroCliente;
}

export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    listaModelos: <iModelos[]>[],
    edtSearch: <HTMLInputElement>{},
    dbCarroCliente: <iCarroCliente>{},
    loading: false,
});


export const actions = {
    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                Placa: { dataField: "PLACA" },
                Modelo: { dataField: "MODELO" },
                Ano: { dataField: "ANO", center: true, width: "12%" },
                Cor: { dataField: "COR" },
                Data: { dataField: "DATA", compare: "dataBrasil", center: true }
            },
            compare: {
                dataBrasil: (r) => utils.dataBrasil(r.DATA)
            },
            query: {
                async execute(rs) {
                    let data = await actions.getCarroCliente({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridPrincipal.querySourceAdd(data)
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbCarroCliente = r;
                },
                duplicity: {
                    dataField: ["PLACA"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });

                        if (Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + " já está cadastrada"
                            );
                            return true;
                        }
                        return false
                    },
                },
                frame: {
                    el: "#pnBotoes",
                    buttons: {
                        novo: {
                            html: "Novo",
                            state: "insert",
                            click: actions.btnInsert,
                        },
                        update: {
                            html: "Alterar",
                            state: "update",
                            click: actions.btnEdit,
                            id: "btnUpdate",
                        },
                        excluir: {
                            html: "Excluir",
                            state: "delete",
                            click: actions.btnDelete,
                        },
                        salvar: {
                            html: "Salvar",
                            state: "save",
                            click: actions.btnSave,
                            preLoad: "Salvando",
                        },
                        cancela: {
                            html: "Cancelar",
                            state: "cancel",
                            click: actions.btnCancel,
                        },
                    },
                },
            },
            enter: function () {
                document.getElementById("btnUpdate").click();
            },
        });
    },

    async getCarroCliente({ offset, param }: iParamGetCarroCliente) {
        try {
            state.loading = true;
            const data = await serviceCarroCliente.getCarroCliente({ offset, param });
            state.loading = false

            return data;
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os carros!",
            });
        }
    },

    search() {
        state.gridPrincipal.queryOpen({
            PLACA: state.edtSearch.value.toUpperCase()
        });
    },

    digitarApenasNumeros(value) {
        if (value) {
            value.target.value = value.target.value.replace(/[^0-9]/g, "");
            state.dbCarroCliente.ANO = value.target.value
        }
    },

    async getModelos() {
        try {
            const data = await serviceCarroCliente.getModelos();
            state.listaModelos = data

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os modelos!",
            });
        }
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = serviceCarroCliente.getDuplicidade({ value, field });

            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Carro já cadastrado!",
            });
        }
    },

    btnInsert() {
        state.pnSearch = true;

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
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

        if (await state.gridPrincipal.getDuplicityAll()) return false;

        if (state.dbCarroCliente.PLACA.length < 8) {
            await Swal.fire({
                icon: "error",
                text: "Inserir uma placa válida!",
            });

            return false;
        }

        if (state.dbCarroCliente.ANO.length < 4) {
            await Swal.fire({
                icon: "error",
                text: "Inserir um ano válido!",
            });

            return false;
        } else {

            let ano_carro = state.dbCarroCliente.ANO

            ano_carro = Number(ano_carro)

            if (ano_carro <= 1500 || ano_carro >= 2099) {
                await Swal.fire({
                    icon: "error",
                    text: "Inserir um ano válido!",
                });

                return false;
            }
        }

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            actions.toInsert();
        }
        else {
            actions.toUpdate();
        }

        state.gridPrincipal.enable();

        state.pnSearch = false;
        state.gridPrincipal.focus();
    },

    btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async toDelete() {
        try {
            let placa = state.dbCarroCliente.PLACA

            state.loading = true
            await serviceCarroCliente.toDelete(placa);
            state.loading = false
            state.gridPrincipal.deleteLine();
        }
        catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir o carro!",
            });
        }
    },

    async toInsert() {
        try {
            let newFields = <any>(
                state.gridPrincipal.getElementSideBySideJson(true, false)
            );

            state.loading = true
            await serviceCarroCliente.toInsert(newFields);
            state.loading = false

            state.gridPrincipal.insertLine(newFields);

        }
        catch (error) {
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
                ...state.dbCarroCliente,
                ...dadosDiff.new,
            }

            //@ts-ignore
            let placaAntiga = dadosDiff?.old?.PLACA || state.dbCarroCliente.PLACA

            state.loading = true
            await serviceCarroCliente.toUpdate(dadosAtualizados, placaAntiga);
            state.loading = false

            state.dbCarroCliente = dadosAtualizados as iCarroCliente;
            state.gridPrincipal.dataSource(dadosAtualizados);

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao atualizar carro!",
            });
        }
    }

}
