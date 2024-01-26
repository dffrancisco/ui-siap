import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import serviceTransportadoras from "./services/transportadoras.service"
import { iTranspordadoras, iCidades, iParamGetTransportadoras, iFieldDuplicity } from "./interfaces";
import utils from "@/ts/utils";

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iTranspordadoras
}

export const state = reactive(({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    toggleDisabled: false,
    cnpjDisabled: false,
    listaCidades: <iCidades[]>[],
    edtSearch: <HTMLInputElement>{},
    dbTransportadora: <iTranspordadoras>{},
    loading: false,
    isChecked: false,
}))

export const actions = {

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 250,
            count: true,
            columns: {
                'CNPJ': { dataField: 'CGC_TRANSPORTADORA', width: "20%" },
                'Razão Social': { dataField: 'RAZAO_SOCIAL' },
                'Cidade': { dataField: 'CIDADE', width: "22%" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getTransportadoras({
                        offset: rs.offset,
                        param: rs.param,
                        checkboxAtiva: state.isChecked
                    });
                    state.gridPrincipal.querySourceAdd(data)
                }
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) { state.dbTransportadora = r },
                duplicity: {
                    dataField: ['CGC_TRANSPORTADORA'],
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
                            html: 'Inativar',
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
        })
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

    encontrarCidades(COD_CIDADE: number) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if ((cidade.COD_CIDADE == COD_CIDADE)) {
                return true;
            }

            return false;
        })

        let cidade = cidadeEncontrada.DESCRICAO

        return cidade
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

    btnInsert() {

        state.pnSearch = true
        state.toggleDisabled = true
        state.dbTransportadora = {} as iTranspordadoras

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

        state.pnSearch = true
        state.toggleDisabled = true
        state.cnpjDisabled = true

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

        if (state.dbTransportadora.CGC_TRANSPORTADORA.length < 18) {
            Swal.fire({
                icon: 'error',
                text: 'CNPJ inválido!'
            })
            return false;
        }

        if (state.dbTransportadora.TELEFONE1.length < 14) {
            Swal.fire({
                icon: 'error',
                text: 'Telefone inválido!'
            })
            return false;
        }

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false)
            actions.toInsert();
        else {
            actions.toUpdate();
        }

        state.gridPrincipal.enable();

        state.toggleDisabled = false
        state.cnpjDisabled = false
        state.pnSearch = false

        state.gridPrincipal.focus();
    },

    btnCancel() {

        state.pnSearch = false;
        state.toggleDisabled = false;
        state.cnpjDisabled = false;

        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async getTransportadoras({ param, offset, checkboxAtiva }: iParamGetTransportadoras) {
        try {

            state.loading = true;
            const data = await serviceTransportadoras.getTransportadoras({ param, offset, checkboxAtiva });
            state.loading = false;

            return data;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as transportadoras'
            })
        }
    },

    async getCidades() {
        try {
            const data = await serviceTransportadoras.getCidades();
            state.listaCidades = data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as cidades'
            })
        }
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceTransportadoras.getDuplicidade({ value, field });

            return data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Cidade já Cadastrada'
            })
        }
    },

    async toInsert() {
        try {
            let newFields = <any>(
                state.gridPrincipal.getElementSideBySideJson(true, false)
            )

            state.loading = true
            let data = await serviceTransportadoras.toInsert(newFields)
            state.loading = false

            let cidade = actions.encontrarCidades(newFields.COD_CIDADE)
            state.gridPrincipal.insertLine({
                ...newFields,
                CIDADE: cidade,
                ID_TRANSPORTADORA: data.ID_TRANSPORTADORA
            });

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inserir transportadora'
            })
        }
    },

    async toUpdate() {
        try {
            let dadosDiff = state.gridPrincipal.getDiffTwoJson(true, false);

            if (dadosDiff.diff == false) {
                return
            }

            let dadosAtualizados = {
                ...state.dbTransportadora,
                ...dadosDiff.new
            }

            state.loading = true
            await serviceTransportadoras.toUpdate(dadosAtualizados)
            state.loading = false

            state.dbTransportadora = dadosAtualizados as iTranspordadoras;

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

    async toInativar() {
        try {
            let ID_TRANSPORTADORA = state.dbTransportadora.ID_TRANSPORTADORA
            let DELETADO = state.dbTransportadora.DELETADO

            state.loading = true
            await serviceTransportadoras.toInativar(ID_TRANSPORTADORA, DELETADO);
            state.loading = false

            state.gridPrincipal.deleteLine();
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inativar transportadora'
            })
        }
    },

    async buscaCEP() {
        try {

            if (state.dbTransportadora.CEP == "") {
                return false
            }

            let cep = state.dbTransportadora.CEP

            state.loading = true

            let request = await serviceTransportadoras.buscarCEP(cep)
            let dataJSON = await request.data;

            let cod_cidade = actions.encontrarCodCidade(dataJSON.ibge)
            let bairro = dataJSON.bairro
            let endereco = dataJSON.logradouro

            state.dbTransportadora.ENDERECO = endereco
            state.dbTransportadora.BAIRRO = bairro.substring(0, 20)
            state.dbTransportadora.COD_CIDADE = cod_cidade

            state.loading = false

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'CEP não existente!'
            })
        }
    },

    async buscarCNPJ() {
        try {

            if (state.dbTransportadora.CGC_TRANSPORTADORA == "") {
                return false
            }

            let cnpj = state.dbTransportadora.CGC_TRANSPORTADORA.replace(/[^\d]/g, '')

            state.loading = true

            let data = await serviceTransportadoras.getDadosCnpj(cnpj)

            console.log(data)

            let razao_social = data.nome.substring(0, 50)
            let email = data.email
            let telefone = data.telefone
            let cep = data.cep
            let endereco = data.logradouro.substring(0, 40)
            let bairro = data.bairro.substring(0, 20)
            let cod_cidade = actions.encontrarCodCidade2(data.municipio.toUpperCase())

            state.dbTransportadora.RAZAO_SOCIAL = razao_social
            state.dbTransportadora.EMAIL = email
            state.dbTransportadora.TELEFONE1 = telefone
            state.dbTransportadora.CEP = cep
            state.dbTransportadora.ENDERECO = endereco
            state.dbTransportadora.BAIRRO = bairro
            state.dbTransportadora.COD_CIDADE = cod_cidade


            state.loading = false

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'CNPJ não existente!'
            })
        }
    },

}


export default { state, actions }