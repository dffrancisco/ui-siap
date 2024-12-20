import { reactive, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceFornecedores from './services/fornecedores.service';
import {
    iFornecedor,
    iParamGetFornecedor,
    iRepresentantes,
    iCidades,
    iGetFornecedoresResponse
} from "./interfaces";

const openModal = () => {
    state.modalFornecedorOpened = true;
};

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    edtSearch: <HTMLInputElement>{},
    lista: <iFornecedor[]>[],
    dbFornecedor: <iFornecedor>{},
    dbRepresentante: <iRepresentantes>{},
    loading: false,
    modalFornecedorOpened: false,
    selectedFornecedor: <iFornecedor | null>null,
    checkboxAtiva: false,
    isChecked: false,
    listaCidades: <iCidades[]>[],
    toggleDisabled: false,
    cnpjDisabled: false,
    cepInserido: false


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

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                CNPJ: { dataField: "CGC_FORNECEDOR" },
                "Razão Social": { dataField: "RAZAO_SOCIAL" },
                Cidade: { dataField: "CIDADE", center: true },
            },
            query: {
                async execute(rs) {
                    const data = await actions.getFornecedores({
                        offset: rs.offset,
                        param: {
                            ...rs.param,
                            checkboxAtiva: state.isChecked,
                        },
                    });
                    state.gridPrincipal.querySourceAdd(data);
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbFornecedor = r as iFornecedor;
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

    async getFornecedores({ offset, param }: iParamGetFornecedor) {
        try {
            state.loading = true;

            const fornecedores = await serviceFornecedores.getFornecedores({
                offset,
                param,
                checkboxAtiva: state.checkboxAtiva,
            });
            return fornecedores;
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

    search() {
        if (state.isChecked) {
            document.querySelector('button[state="delete"]').textContent = 'Reativar';
        } else {
            document.querySelector('button[state="delete"]').textContent = 'Inativar';
        }

        state.gridPrincipal.queryOpen({
            RAZAO_SOCIAL: state.edtSearch.value.toUpperCase()
        });
    },

    async btnInsert() {
        state.pnSearch = true;
        state.toggleDisabled = true
        state.dbFornecedor = {} as iFornecedor;

        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit() {

        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                text: "Nenhum registro selecionado.",
                icon: "info",
            });
            return false;
        }

        state.pnSearch = true
        state.toggleDisabled = true
        state.cnpjDisabled = true
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
            return false

        if (await state.gridPrincipal.getDuplicityAll())
            return false;

        if (state.dbFornecedor.CGC_FORNECEDOR.length < 18) {
            Swal.fire({
                icon: 'error',
                text: 'CNPJ inválido!'
            })
            return false;
        }


        if (state.dbFornecedor.EMAIL) {
            if (!actions.validarEmail()) {
                Swal.fire({
                    icon: 'error',
                    text: 'E-mail inválido!'
                })
                return false;
            }
        }


        if (state.gridPrincipal.dataSource() == false)
            actions.insertFornecedor();
        else {
            actions.updateFornecedor();
        }

        state.gridPrincipal.enable();

        state.toggleDisabled = false
        state.cnpjDisabled = false
        state.pnSearch = false
        state.cepInserido = false

        state.gridPrincipal.focus();
    },

    async btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
        state.toggleDisabled = false;
        state.cnpjDisabled = false;
        state.cepInserido = false
    },

    async toInativar() {
        try {
            let ID_FORNECEDOR = state.dbFornecedor.ID_FORNECEDOR
            let DELETADO = state.dbFornecedor.DELETADO

            state.loading = true
            await serviceFornecedores.toInativar(ID_FORNECEDOR, DELETADO);
            state.loading = false

            state.gridPrincipal.deleteLine();
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inativar fornecedor'
            })
        }
    },

    async insertFornecedor() {
        try {
            let newFields = <any>(
                state.gridPrincipal.getElementSideBySideJson(true, false)
            )

            state.loading = true
            let data = await serviceFornecedores.toInsert(newFields)
            state.loading = false

            let cidade = null

            if (newFields.COD_CIDADE) {
                cidade = actions.encontrarCidades(newFields.COD_CIDADE)
            }

            state.gridPrincipal.insertLine({
                ...newFields,
                CIDADE: cidade,
                ID_FORNECEDOR: data.ID_FORNECEDOR
            });

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inserir transportadora'
            })
        }
    },


    async updateFornecedor() {
        try {
            let dadosDiff = state.gridPrincipal.getDiffTwoJson(true, false);

            if (dadosDiff.diff == false) {
                return
            }

            let dadosAtualizados = {
                ...state.dbFornecedor,
                ...dadosDiff.new
            }

            state.loading = true
            await serviceFornecedores.toUpdate(dadosAtualizados)
            state.loading = false

            state.dbFornecedor = dadosAtualizados as iFornecedor;

            let cidade = actions.encontrarCidades(dadosAtualizados.COD_CIDADE)
            state.gridPrincipal.dataSource({
                ...dadosAtualizados,
                CIDADE: cidade
            })

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao atualizar transportadora'
            })
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

    async selecionarRepresentante(representante: iRepresentantes) {
        if (!representante) {
            Swal.fire({
                text: "Nenhum representante selecionado.",
                icon: "error",
            });
            return;
        }
        state.dbRepresentante.NOME = representante.NOME;
        actions.closeModal();
    },

    validarEmail() {
        let email = state.dbFornecedor.EMAIL;

        let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regexEmail.test(email);

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

    async buscarCNPJ() {
        try {

            if (!state.dbFornecedor.CGC_FORNECEDOR) {
                return false
            }

            if (state.cnpjDisabled == true) {
                return false
            }

            let cnpj = state.dbFornecedor.CGC_FORNECEDOR.replace(/[^\d]/g, '')

            state.loading = true

            let data = await serviceFornecedores.getDadosCnpj(cnpj)

            let razao_social = data.nome.substring(0, 50)
            let email = data.email
            let telefone = data.telefone.substring(0, 15)
            let cep = data.cep
            let endereco = data.logradouro.substring(0, 40)
            let bairro = data.bairro.substring(0, 20)
            let cod_cidade = actions.encontrarCodCidade2(data.municipio.toUpperCase())

            state.dbFornecedor.RAZAO_SOCIAL = razao_social
            state.dbFornecedor.EMAIL = email
            state.dbFornecedor.TELEFONE1 = telefone
            state.dbFornecedor.CEP = cep
            state.dbFornecedor.ENDERECO = endereco
            state.dbFornecedor.BAIRRO = bairro
            state.dbFornecedor.COD_CIDADE = cod_cidade

            if (state.dbFornecedor.ENDERECO) {
                state.cepInserido = true
            }


            state.loading = false

        } catch (error) {
            state.loading = false;
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

    encontrarCodCidade2(DESCRICAO: string) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if ((cidade.DESCRICAO == DESCRICAO)) {
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

};
