
import { nextTick, reactive, onMounted, ref } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import {
    iFieldDuplicity,
    iRepresentantesParam,
    iMarcas,
    iCidades,
} from "./interfaces";
import utils from "@/ts/utils";
import serviceRepresentantes from "./services/representantes.service";
import { useEventListener } from "@vueuse/core";
const inputSearch = ref();

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iRepresentantesParam[]>[],
    edtSearch: "",
    listaCidades: <iCidades[]>[],
    dbRepresentantes: <iRepresentantesParam>{},
    loading: false,
    modalFornecedorOpened: false,
    marca: <iMarcas>{},
    cepInserido: false,
    RepresentanteJaExiste: false,
    representanteSelecionado: <iRepresentantesParam>{},

});

export const eventListener = useEventListener(document, "keydown", async (event) => {
    if (event.key === "F1") {
        document.getElementById("edtSearch")?.focus();
        event.preventDefault();
        event.stopPropagation();
    }
});



export const actions = {
    async init() {
        actions.grids();
        await actions.getCidades();
        await actions.getRepresentantes();
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 190,
            count: true,
            columns: {
                "Nome": { dataField: "NOME" },
                "E-mail": { dataField: "EMAIL" },
                "Telefone": { dataField: "TELEFONE" },
                "Celular": { dataField: "CELULAR" },
            },


            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbRepresentantes = r;
                },
                duplicity: {
                    dataField: ["CEP"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });
                        if (dup && Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + " já cadastrado!"
                            );
                            return true;
                        }
                        return false;
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
                document.getElementById("btnUpdate")?.click();
            },
        });
    },

    async getRepresentantes() {
        try {
            state.loading = true;
            const param = state.edtSearch?.toUpperCase();

            const data = await serviceRepresentantes.getRepresentantes(param);
            state.gridPrincipal.source(data);
            state.gridPrincipal.focus();
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "erro ao exibir registro de representantes",
            });
        } finally {
            state.loading = false;
        }
    },

    async getCidades() {
        try {
            const data = await serviceRepresentantes.getCidades();
            state.listaCidades = data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as cidades'
            })
        }
    },

    async search() {
        state.gridPrincipal.clear();
        const data = await actions.getRepresentantes();
        state.gridPrincipal.source(data);
    },

    closeModal() {
        state.modalFornecedorOpened = false;
    },

    selecionarRepresentante(representanteSelecionado: iRepresentantesParam) {

        state.dbRepresentantes.MARCAS = representanteSelecionado.DESCRICAO;
        state.representanteSelecionado = representanteSelecionado;
        actions.closeModal();
    },


    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceRepresentantes.getDuplicidade({ value, field });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao executar verificação de duplicidade",
            });
        }
    },

    async btnInsert() {

        state.pnSearch = true;
        state.dbRepresentantes = {} as iRepresentantesParam;
        await nextTick();
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire({
                icon: "info",
                text: "Operação cancelada, nenhum registro selecionado.",
            });
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {

        if (!state.gridPrincipal.dataSource()) {
            Swal.fire({
                icon: "info",
                text: "Operação cancelada, selecione um registro.",
            });
            return false;
        }

        if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
            await actions.toDelete();
            state.gridPrincipal.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR()) {
            return false;
        }
        if (await state.gridPrincipal.getDuplicityAll()) {
            return false;
        }

        if (!state.gridPrincipal.dataSource()) {
            actions.toInsert();
        } else {
            actions.toUpdate();
        }
        state.pnSearch = false;
        await nextTick();
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async btnCancel() {
        state.pnSearch = false;
        let linhaGrid = <any>state.gridPrincipal.getIndex();
        await nextTick();
        state.gridPrincipal.enable();
        state.gridPrincipal.focus(linhaGrid);
    },

    async btnSearch() {
        state.gridPrincipal.queryOpen({
            search: inputSearch.value.value,
        });
    },

    async toDelete() {
        try {
            let id_Representantes = state.dbRepresentantes.ID_REPRESENTANTE;
            state.loading = true;

            await serviceRepresentantes.toDelete(id_Representantes);
            state.gridPrincipal.deleteLine();
            await Swal.fire({
                icon: "success",
                text: "Representante excluído com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao excluir o representante.",
                text: "erro ao executar exclusão",
            });
        } finally {
            state.loading = false;
        }
    },

    async toInsert() {
        try {
            state.loading = true;

            let newFields = {

                ID_REPRESENTANTE: state.dbRepresentantes.ID_REPRESENTANTE,
                NOME: state.dbRepresentantes.NOME?.toUpperCase(),
                ENDERECO: state.dbRepresentantes.ENDERECO,
                BAIRRO: state.dbRepresentantes.BAIRRO,
                COD_CIDADE: state.dbRepresentantes.COD_CIDADE,
                CEP: state.dbRepresentantes.CEP,
                TELEFONE: state.dbRepresentantes.TELEFONE,
                TELEFONE2: state.dbRepresentantes.TELEFONE2,
                FAX: state.dbRepresentantes.FAX,
                CELULAR: state.dbRepresentantes.CELULAR,
                EMAIL: state.dbRepresentantes.EMAIL,
                OBS: state.dbRepresentantes.OBS,
                MARCAS: state.dbRepresentantes.MARCAS,
                search: state.dbRepresentantes.NOME?.toUpperCase() || "",
            };

            await serviceRepresentantes.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });
            await Swal.fire({
                icon: "success",
                text: "Representante adicionado com sucesso!",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: "Erro ao adicionar representante.",
            });
        } finally {
            state.loading = false;
        }
    },
    async toUpdate() {
        try {
            let param = {
                NOME: state.dbRepresentantes.NOME?.toUpperCase(),
                ENDERECO: state.dbRepresentantes.ENDERECO?.toUpperCase(),
                BAIRRO: state.dbRepresentantes.BAIRRO?.toUpperCase(),
                COD_CIDADE: state.dbRepresentantes.COD_CIDADE,
                CEP: state.dbRepresentantes.CEP,
                TELEFONE: state.dbRepresentantes.TELEFONE,
                TELEFONE2: state.dbRepresentantes.TELEFONE2,
                FAX: state.dbRepresentantes.FAX,
                CELULAR: state.dbRepresentantes.CELULAR,
                EMAIL: state.dbRepresentantes.EMAIL?.toLowerCase(),
                OBS: state.dbRepresentantes.OBS,
                MARCAS: state.dbRepresentantes.MARCAS,
                ID_REPRESENTANTE: state.dbRepresentantes.ID_REPRESENTANTE,
            };

            state.loading = true;

            await serviceRepresentantes.toUpdate(param);

            state.gridPrincipal.dataSource(param);

            await Swal.fire({
                icon: "success",
                text: "Representante atualizado com sucesso.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar representante!",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    encontrarCodCidade(COD_IBGE: string) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if (cidade.COD_IBGE == COD_IBGE) {
                return true;
            }

            return false;

        })

        if (cidadeEncontrada) {
            let cidade = cidadeEncontrada.COD_CIDADE
            return cidade
        } else {
            let cidade = null

            return cidade
        }
    },

    encontrarCidades(COD_CIDADE: number) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if (cidade.COD_CIDADE == COD_CIDADE) {
                return true;
            }

            return false;
        })

        if (cidadeEncontrada) {
            let cidade = cidadeEncontrada.DESCRICAO
            return cidade
        } else {
            let cidade = null
            return cidade
        }
    },

    async buscaCEP() {
        try {

            if (state.cepInserido == true) {
                return false
            }

            if (!state.dbRepresentantes.CEP) {
                return false
            }

            let cep = state.dbRepresentantes.CEP

            state.loading = true

            let request = await serviceRepresentantes.buscarCEP(cep)
            let dataJSON = await request.data;

            let cod_cidade = actions.encontrarCodCidade(dataJSON.ibge)
            let bairro = dataJSON.bairro
            let endereco = dataJSON.logradouro

            state.dbRepresentantes.ENDERECO = endereco
            state.dbRepresentantes.BAIRRO = bairro.substring(0, 20)
            state.dbRepresentantes.COD_CIDADE = cod_cidade

            state.loading = false

        } catch (error) {
            state.loading = false;
        }
    },
};

export default { state, actions, eventListener };
