import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iCarros, iProdutoMontagem, iParamGetProdutos } from "./interfaces";
import serviceMontagemProdutos from "./services/montagem_produto.service"
import utils from "@/ts/utils";

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iProdutoMontagem
}

export const state = reactive(({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    listaCarros: <iCarros[]>[],
    edtSearch: <HTMLInputElement>{},
    dbProdutoMontagem: <iProdutoMontagem>{},
    loading: false
}))

export const actions = {
    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                "Descrição Montagem": { dataField: "DESC_MONTAGEN"},
                "Carro": { dataField: "CARRO", width: "30%"},
                "Valor": { dataField: "VALOR", width: "15%", center: true, compare: "valorFormatado"}
            },
            query: {
                async execute(rs) {
                    let data = await actions.getProdutos({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridPrincipal.querySourceAdd(data);
                }
            },
            compare: {
                valorFormatado: (r) => utils.formatValor(r.VALOR)
            },
            sideBySide: {
                el: '#pnCampos',
                vModel(r) { state.dbProdutoMontagem = r },
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

    search() {
        state.gridPrincipal.queryOpen({
            DESC_MONTAGEN: state.edtSearch.value.toUpperCase()
        });
    },

    encontrarCarros(ID_CARRO) {
        const carroEncontrado = state.listaCarros.find(carro => {
            if ((carro.ID_CARRO == ID_CARRO)) {
                return true;
            }

            return false;
        })

        let carro = carroEncontrado.DESCRICAO

        return carro
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
                text: "Nenhum registro selecionado para alteração, operação cancelada!"
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
                icon: "info",
                text: "Nenhum registro selecionado para exclusão, operação cancelada!"
            })
            return false;
        }

        if (await msgConfirm("Confirmação", "Confirma exclusão deste registro?")) {
            await actions.toDelete();
            state.gridPrincipal.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR())
            return false;

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false)
            actions.toInsert();
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

    async getProdutos ({param, offset}: iParamGetProdutos) {
        try {
            state.loading = true;
            const data = await serviceMontagemProdutos.getProdutos({param, offset});
            state.loading = false;

            return data;
        } catch(error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os produtos!"
            })
        }
    },

    async getCarros () {
        try {
            const data = await serviceMontagemProdutos.getCarros();
            state.listaCarros = data;
        } catch(error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os carros!"
            })
        }
    },

    async toInsert() {

    },

    async toUpdate() {

    },

    async toDelete() {

    },
}





export default { state, actions }