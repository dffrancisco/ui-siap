import { reactive, nextTick } from "vue";
import Swal from "sweetalert2";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceFornecedores from './services/fornecedores.service';
import { dataBrasil } from "@/ts/utils";
import {
    iFornecedor,
    iParamGetFornecedor,
    iRepresentantes,
    iCidades,
    iFieldDuplicity,
} from "./interfaces";


export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    edtSearch: "",
    lista: <iFornecedor[]>[],
    dbFornecedor: <iFornecedor>{},
    dbRepresentante: <iRepresentantes>{},
    loading: false,
    modalFornecedorOpened: false,
    selectedFornecedor: <iFornecedor | null>null,
    isChecked: false,
    listaCidades: <iCidades[]>[],
    toggleDisabled: false,
    cnpjDisabled: false,
    cepInserido: false,
    representanteSelecionado: <iFornecedor>{},


});


export const eventListener = (event: KeyboardEvent) => {
    if (event.key === "F1") {
        document.getElementById("edtSearch")?.focus();
        event.preventDefault();
        event.stopPropagation();
    }
};

export const actions = {
    async init() {
        actions.grids();
        await actions.getCidades();
        state.gridPrincipal.queryOpen({}, () => {
            state.gridPrincipal.focus();
        });

    },

    formatCadastroDate() {
        if (state.dbFornecedor.CADASTRO) {
            return dataBrasil(state.dbFornecedor.CADASTRO);
        }
        return "";
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 160,
            count: true,
            columns: {
                CNPJ: { dataField: "CGC_FORNECEDOR", width: "20%" },
                "Razão Social": { dataField: "RAZAO_SOCIAL" },
                Cidade: { dataField: "CIDADE", center: true, width: "22%" },
            },
            query: {

                async execute(rs) {
                    let data = await actions.getFornecedores({
                        offset: rs.offset,
                        param: rs.param,
                        checkboxAtiva: state.isChecked,

                    });
                    state.gridPrincipal.querySourceAdd(data);
                }

            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbFornecedor = r as iFornecedor;



                },
                duplicity: {
                    dataField: ['CGC_FORNECEDOR'],
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
                    el: "#pnBotoes",
                    buttons: {
                        novo: { html: "Novo", state: "insert", click: actions.btnInsert },
                        alterar: { html: "Alterar", state: "update", click: actions.btnEdit },
                        excluir: { html: "Inativar", state: "delete", click: actions.btnDelete },
                        salvar: { html: "Salvar", state: "save", click: actions.btnSave },
                        cancelar: { html: "Cancelar", state: "cancel", click: actions.btnCancel },
                    },
                },
            },
        });
    },

    async getFornecedores({ offset, param, checkboxAtiva }: iParamGetFornecedor) {
        try {
            state.loading = true;

            const data = await serviceFornecedores.getFornecedores({
                offset,
                param,
                checkboxAtiva
            });
            state.loading = false;
            return data;
        } catch (error) {
            await Swal.fire({
                text: "Erro ao carregar fornecedores.",
                icon: "error",
            });
            throw error;
        } finally {
            state.loading = false;
        }
    },

    async getCidades() {
        try {
            const data = await serviceFornecedores.getCidades();
            state.listaCidades = data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as cidades'
            })
        }
    },



    async search() {
        if (state.isChecked) {
            document.querySelector('button[state="delete"]').textContent = 'Reativar';
        } else {
            document.querySelector('button[state="delete"]').textContent = 'Inativar';
        }

        const searchValue = state.edtSearch?.toUpperCase();
        state.gridPrincipal.queryOpen({
            RAZAO_SOCIAL: searchValue,
            CGC_FORNECEDOR: searchValue,


        });
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbFornecedor = {} as iFornecedor;
        await nextTick();
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {

        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                text: "Nenhum registro selecionado.",
                icon: "info",
            });
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {


        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: 'info',
                text: 'Nenhum registro selecionado para alteração, operação cancelada!'
            })
            return false;
        }
        if (!state.isChecked) {
            if (await msgConfirm("Confirmação", "Confirma a inativação deste registro?")) {
                await actions.toInativar()
                state.gridPrincipal.focus();
            }
        } else {
            if (await msgConfirm("Confirmação", "Confirma a reativação deste registro?")) {
                await actions.toInativar()
                state.gridPrincipal.focus();
            }

        }
        state.gridPrincipal.clearElementSideBySide();
    },

    async btnSave() {
        if (utils.validaOBR())
            return

        const isNew = !state.gridPrincipal.dataSource();
        if (isNew) {
            await actions.insertFornecedor();
        } else {
            await actions.updateFornecedor();
        }
        if (!state.dbFornecedor.CGC_FORNECEDOR) {
            await Swal.fire({
                icon: "warning",
                title: "Campo obrigatório!",
                text: "CPF ou CNPJ deve ser preenchido.",
            });
            return false
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

    async toInativar() {
        try {
            let ID_FORNECEDOR = state.dbFornecedor.ID_FORNECEDOR
            let DELETADO = state.dbFornecedor.DELETADO

            state.loading = true
            await serviceFornecedores.toInativar(ID_FORNECEDOR, DELETADO);
            state.loading = false

            Swal.fire({
                icon: "success",
                text: "Fornecedor inativado com sucesso.",

            });
            state.gridPrincipal.deleteLine();
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inativar fornecedor'
            })
        }
    },


    encontrarCidades(COD_CIDADE: number) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if ((cidade.COD_CIDADE == COD_CIDADE)) {
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

    encontrarCodCidade(COD_IBGE: string) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if ((cidade.COD_IBGE == COD_IBGE)) {
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


    async insertFornecedor() {
        state.loading = true;

        const param = {
            CGC_FORNECEDOR: state.dbFornecedor.CGC_FORNECEDOR,
            RAZAO_SOCIAL: state.dbFornecedor.RAZAO_SOCIAL,
            NOME_FANTAZIA: state.dbFornecedor.NOME_FANTAZIA,
            INSC_ESTADUAL: state.dbFornecedor.INSC_ESTADUAL,
            ENDERECO: state.dbFornecedor.ENDERECO,
            COD_CIDADE: state.dbFornecedor.COD_CIDADE,
            BAIRRO: state.dbFornecedor.BAIRRO,
            TELEFONE1: state.dbFornecedor.TELEFONE1,
            TELEFONE2: state.dbFornecedor.TELEFONE2,
            ID_REPRESENTANTE: state.dbFornecedor.ID_REPRESENTANTE,
            CONTADO: state.dbFornecedor.CONTADO,
            MUNICIPIO: state.dbFornecedor.MUNICIPIO,
            CEP: state.dbFornecedor.CEP,
            HOME_PAGE: state.dbFornecedor.HOME_PAGE,
            EMAIL: state.dbFornecedor.EMAIL,
            OBS: state.dbFornecedor.OBS,
            CADASTRO: state.dbFornecedor.CADASTRO,
            DELETADO: state.dbFornecedor.DELETADO,
            ID_FORNECEDOR: state.dbFornecedor.ID_FORNECEDOR,
            ID_EMPRESA: state.dbFornecedor.ID_EMPRESA,


        };

        try {

            await serviceFornecedores.toInsert(param);


            Swal.fire({
                icon: "success",
                text: "Fornecedor inserido com sucesso.",

            });

            state.dbFornecedor = { ...state.dbFornecedor, ...param };

            const cidade = actions.encontrarCidades(param.COD_CIDADE);
            state.gridPrincipal.dataSource({
                ...param,
                CIDADE: cidade,
            });


        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao inserir fornecedor!",
            });
        } finally {
            state.loading = false;
        }
    },

    async updateFornecedor() {
        state.loading = true;

        const param = {
            CGC_FORNECEDOR: state.dbFornecedor.CGC_FORNECEDOR,
            RAZAO_SOCIAL: state.dbFornecedor.RAZAO_SOCIAL,
            NOME_FANTAZIA: state.dbFornecedor.NOME_FANTAZIA,
            INSC_ESTADUAL: state.dbFornecedor.INSC_ESTADUAL,
            ENDERECO: state.dbFornecedor.ENDERECO,
            COD_CIDADE: state.dbFornecedor.COD_CIDADE,
            BAIRRO: state.dbFornecedor.BAIRRO,
            TELEFONE1: state.dbFornecedor.TELEFONE1,
            TELEFONE2: state.dbFornecedor.TELEFONE2,
            ID_REPRESENTANTE: state.dbFornecedor.ID_REPRESENTANTE,
            CONTADO: state.dbFornecedor.CONTADO,
            MUNICIPIO: state.dbFornecedor.MUNICIPIO,
            CEP: state.dbFornecedor.CEP,
            HOME_PAGE: state.dbFornecedor.HOME_PAGE,
            EMAIL: state.dbFornecedor.EMAIL,
            OBS: state.dbFornecedor.OBS,
            CADASTRO: state.dbFornecedor.CADASTRO,
            DELETADO: state.dbFornecedor.DELETADO,
            ID_FORNECEDOR: state.dbFornecedor.ID_FORNECEDOR,
            ID_EMPRESA: state.dbFornecedor.ID_EMPRESA,

        };

        try {

            await serviceFornecedores.toUpdate(param);


            Swal.fire({
                icon: "success",
                text: "Fornecedor atualizado com sucesso.",

            });

            state.dbFornecedor = { ...state.dbFornecedor, ...param };

            const cidade = actions.encontrarCidades(param.COD_CIDADE);
            state.gridPrincipal.dataSource({
                ...param,
                CIDADE: cidade,
            });


        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao atualizar fornecedor!",
            });
        } finally {
            state.loading = false;
        }
    },

    closeModal() {
        state.modalFornecedorOpened = false;
    },

    async saveFornecedorModal() {
        try {
            if (!state.selectedFornecedor) {
                Swal.fire({
                    text: "Nenhum fornecedor selecionado.",
                    icon: "error",
                });
                return;
            }

            if (state.selectedFornecedor.ID_FORNECEDOR) {
                await actions.updateFornecedor();
            } else {
                await actions.insertFornecedor();
            }

            actions.closeModal();
        } catch (error) {
            Swal.fire({
                text: "Erro ao salvar fornecedor.",
                icon: "error",
            });
            console.error(error);
        }
    },

    selecionarRepresentante(representanteSelecionado: iFornecedor) {
        state.dbFornecedor.NOME = representanteSelecionado.NOME
        state.dbFornecedor.ID_REPRESENTANTE = representanteSelecionado.ID_REPRESENTANTE
        state.representanteSelecionado = representanteSelecionado;
        actions.closeModal();
    },


    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceFornecedores.getDuplicidade({ value, field });

            return data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Fornecedor já Cadastrado'
            })
        }
    },
    async buscaCEP() {
        try {

            if (state.cepInserido == true) {
                return false
            }

            if (!state.dbFornecedor.CEP) {
                return false
            }

            let cep = state.dbFornecedor.CEP

            state.loading = true

            let request = await serviceFornecedores.buscarCEP(cep)
            let dataJSON = await request.data;

            let cod_cidade = actions.encontrarCodCidade(dataJSON.ibge)
            let bairro = dataJSON.bairro
            let endereco = dataJSON.logradouro

            state.dbFornecedor.ENDERECO = endereco
            state.dbFornecedor.BAIRRO = bairro.substring(0, 20)
            state.dbFornecedor.COD_CIDADE = cod_cidade

            state.loading = false

        } catch (error) {
            state.loading = false;
        }
    },


}

export default { state, actions }
