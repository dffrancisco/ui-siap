import { computed, onUnmounted, reactive } from "vue";
import {
    iCarros,
    iDeleteRequisicaoCompraParam,
    iDeleteRequisicaoComprasItemParam,
    iFavorecido,
    iFinalizarRequisicaoCompraParam,
    iGetRequisicaoCompraItensParam,
    iGetRequisicaoCompraParam,
    iInsertOrUpdateItemParam,
    iInsertRequisicaoCompraParam,
    iMarcas,
    iProduto,
    iItemToEdit,
    iRequisicaoCompra,
    iRequisicaoItem,
    iInsertItemNovoParam,
    iItemNovoToEdit
} from "./interfaces";
import moment from "moment";
import requisicaoCompraService from "./services/requisicaoCompra.service";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils, { iColumnPrint } from "@/ts/utils";
import { useEventListener } from "@vueuse/core";

const eventListener = useEventListener(document, "keydown", async (event) => {
    if (
        !state.modalLocalizarRequisicaoOpened &&
        !state.modalNovaRequisicaoOpened &&
        !state.modalNovoItemOpened &&
        !state.modalInformarQtdItemOpened &&
        !state.modalInserirItemSemCadastroOpened
    ) {
        if (event.key === "F1") {
            state.modalLocalizarRequisicaoOpened = true;
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === "F2") {
            state.modalNovaRequisicaoOpened = true;
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === "F3") {
            if (state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA && state.dbRequisicaoCompra.FINALIZADO == "N") {
                state.modalNovoItemOpened = true;
            }

            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === "F6") {
            if (state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA) {
                actions.btnFinalizarRequisicaoCompra();
            }

            event.preventDefault();
            event.stopPropagation();
        }
    }
});

onUnmounted(() => {
    removeEventListener("keydown", eventListener);
});

export const state = reactive({
    dbRequisicaoCompra: <iRequisicaoCompra>{},
    dbRequisicaoItens: <iRequisicaoItem[]>[],
    dbMarcas: <iMarcas[]>[],
    dbCarros: <iCarros[]>[],
    dbItemSelecionado: <iProduto>{},
    dbItemToEdit: <iItemToEdit>{},
    dbItemNovoToEdit: <iItemNovoToEdit>{},

    modalNovaRequisicaoOpened: false,
    modalLocalizarRequisicaoOpened: false,
    modalNovoItemOpened: false,
    modalInformarQtdItemOpened: false,
    modalInserirItemSemCadastroOpened: false,

    loading: false,
})

export const actions = {
    async init() {
        await actions.getDadosToSelectProduto()
    },

    async selecionarFavorecido(favorecido: iFavorecido) {

        state.dbRequisicaoCompra = {} as iRequisicaoCompra
        state.dbRequisicaoItens = []

        state.dbRequisicaoCompra = {
            ...state.dbRequisicaoCompra,
            NOME_FAVORECIDO: favorecido.NOME_FAVORECIDO,
            CNPJ_FAVORECIDO: favorecido.CNPJ_FAVORECIDO,
            DATA_HORA_CRIACAO: moment().format('YYYY-MM-DD'),
            FINALIZADO: 'N'
        }

        await actions.insertRequisicaoCompra(favorecido.ID_FAVORECIDO)

        state.modalNovaRequisicaoOpened = false
    },

    async selecionarRequisicaoCompra(requisicao: iRequisicaoCompra) {
        await actions.getRequisicaoCompra(requisicao.ID_REQUISICAO_COMPRA)
        await actions.getRequisicaoComprasItensPorId()

        state.modalLocalizarRequisicaoOpened = false
    },

    async btnDeleteRequisicaoCompra() {
        if (await msgConfirm('Confirmação', 'Deseja excluir esta requisição?')) {
            await actions.deleteRequisicaoCompra();
        }
    },

    async btnFinalizarRequisicaoCompra() {
        if (state.dbRequisicaoItens.length == 0) {
            Swal.fire({
                text: 'É necessário adicionar itens à requisição.',
                icon: 'warning',
            })
            return;
        }

        if (await msgConfirm('Confirmação', 'Deseja finalizar esta requisição?')) {
            await actions.finalizarRequisicaoCompra();
        }
    },

    async openModalInformarQtdItem(item: iProduto) {
        state.dbItemToEdit = null

        state.dbItemSelecionado = item;
        state.modalInformarQtdItemOpened = true;
    },

    async openModalInserirItemSemCadastro() {
        state.dbItemNovoToEdit = null
        state.modalInserirItemSemCadastroOpened = true
    },

    async openModalEditarItem(item: iRequisicaoItem) {
        if (item.COD_PRODUTO) {
            state.dbItemToEdit = {
                ID_REQUISICAO_COMPRA_ITEM: item.ID_REQUISICAO_COMPRA_ITEM,
                COD_PRODUTO: item.COD_PRODUTO,
                QTD: item.QTD,
                VALOR_UNITARIO: item.VALOR_UNITARIO,
                TOTAL: item.TOTAL,
                DESCRICAO: item.DESCRICAO
            }

            state.modalInformarQtdItemOpened = true

            return
        }

        state.dbItemNovoToEdit = {
            DESCRICAO: item.DESCRICAO,
            ID_REQUISICAO_COMPRA_ITEM: item.ID_REQUISICAO_COMPRA_ITEM,
            QTD: item.QTD,
            VALOR_UNITARIO: item.VALOR_UNITARIO,
            TOTAL: item.TOTAL
        }

        state.modalInserirItemSemCadastroOpened = true
    },

    async btnDeleteItem(item: iRequisicaoItem) {
        if (await msgConfirm('Confirmação', 'Deseja excluir este item?')) {
            await actions.deleteRequisicaoComprasItem(item.ID_REQUISICAO_COMPRA_ITEM);
        }
    },

    getDadosImpresaoArquivo() {
        let dadosToPrint = state.dbRequisicaoItens.map((item) => {
            return {
                DESCRICAO: item.DESCRICAO,
                QTD: item.QTD
            }
        })

        let columns: iColumnPrint[] = [
            {
                key: 'DESCRICAO',
                label: "PRODUTO",
                width: '80%',
            },
            {
                key: 'QTD',
                label: "QUANTIDADE",
                width: '20%',
                align: 'center',
            },
        ];

        return { columns, dadosToPrint };
    },

    async imprimirRequisicao() {
        let { dadosToPrint, columns } = actions.getDadosImpresaoArquivo();

        let titulo = `
        <div style="display: flex; justify-content: center; width: 100%; margin-top: 20px; margin-bottom: 20px">
            <strong style="font-size: 20px">REQUISIÇÃO DE PEÇAS</strong>
        </div>
        `;

        let footer = `
        <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 50px">
            <span>DATA DA SOLICITAÇÃO: ${utils.dataBrasil(state.dbRequisicaoCompra.DATA_HORA_FINALIZADO)}</span>
            <span>EMPRESA SOLICITADA: ${state.dbRequisicaoCompra.NOME_FAVORECIDO}</span>
            <span>SOLICITANTE: ${state.dbRequisicaoCompra.COD_FUNCIONARIO_FINALIZOU} - ${state.dbRequisicaoCompra.LOGIN_FUNCIONARIO_FINALIZOU}</span>
            <span>ASSINATURA DO SOLICITANTE: <strong>_____________________________________________________</strong></span>
        </div>`

        try {
            state.loading = true

            await utils.printComCabecalho(columns, dadosToPrint, titulo, footer);
        } catch (error) {
            console.error(error);
        } finally {
            state.loading = false
        }
    },

    async getDadosToSelectProduto() {
        try {
            state.loading = true;
            const { marcas, carros } = await requisicaoCompraService.getDadosToSelectProduto();

            state.dbMarcas = marcas;
            state.dbCarros = carros;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao carregar as marcas e carros.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async insertRequisicaoCompra(idRequisicaoCompra: number) {
        try {
            state.loading = true;

            let param: iInsertRequisicaoCompraParam = {
                ID_FAVORECIDO: idRequisicaoCompra
            }

            const data = await requisicaoCompraService.insertRequisicaoCompra(param);

            state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA = data.ID_REQUISICAO_COMPRA;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao inserir requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async getRequisicaoCompra(idRequisicao: number) {
        try {
            state.loading = true;

            let param: iGetRequisicaoCompraParam = {
                ID_REQUISICAO_COMPRA: idRequisicao
            }

            const data = await requisicaoCompraService.getRequisicaoCompra(param);

            state.dbRequisicaoCompra = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao buscar requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async deleteRequisicaoCompra() {
        try {
            state.loading = true;

            let param: iDeleteRequisicaoCompraParam = {
                ID_REQUISICAO_COMPRA: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA
            }

            const data = await requisicaoCompraService.deleteRequisicaoCompra(param);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                });

                state.dbRequisicaoCompra = {} as iRequisicaoCompra;
                state.dbRequisicaoItens = [] as iRequisicaoItem[];
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao excluir requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async finalizarRequisicaoCompra() {
        try {
            state.loading = true;

            let param: iFinalizarRequisicaoCompraParam = {
                ID_REQUISICAO_COMPRA: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA,
                VALOR: state.dbRequisicaoCompra.VALOR
            }

            const data = await requisicaoCompraService.finalizarRequisicaoCompra(param);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                });

                state.dbRequisicaoCompra = {
                    ...state.dbRequisicaoCompra,
                    FINALIZADO: 'S',
                    DATA_HORA_FINALIZADO: moment().format('YYYY-MM-DD HH:mm:ss'),
                    COD_FUNCIONARIO_FINALIZOU: data.codFuncionario,
                    LOGIN_FUNCIONARIO_FINALIZOU: data.loginFuncionario,
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao finalizar requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async getRequisicaoComprasItensPorId() {
        try {
            state.loading = true;

            const param: iGetRequisicaoCompraItensParam = {
                ID_REQUISICAO_COMPRA: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA
            }

            const data = await requisicaoCompraService.getRequisicaoComprasItensPorId(param);

            state.dbRequisicaoItens = data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao buscar itens da requisição de compra",
                text: error.message
            });

        } finally {
            state.loading = false;
        }
    },

    async insertOrUpdateItem(param: iInsertOrUpdateItemParam) {
        try {
            state.loading = true;

            param.ID_REQUISICAO_COMPRA = state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA;

            await requisicaoCompraService.insertOrUpdateItem(param);

            state.modalNovoItemOpened = false

            await actions.getRequisicaoComprasItensPorId()

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao adicionar o item.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async deleteRequisicaoComprasItem(idRequisicaoCompraItem: number) {
        try {
            state.loading = true;

            let param: iDeleteRequisicaoComprasItemParam = {
                ID_REQUISICAO_COMPRA_ITEM: idRequisicaoCompraItem
            }

            const data = await requisicaoCompraService.deleteRequisicaoComprasItem(param);

            if (data.success) {
                state.dbRequisicaoItens = state.dbRequisicaoItens.filter(
                    (item: iRequisicaoItem) => item.ID_REQUISICAO_COMPRA_ITEM != idRequisicaoCompraItem
                );

                Swal.fire({
                    icon: "success",
                    title: data.msg,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao excluir o item.",
                text: error.message
            })
        } finally {
            state.loading = false;
        }
    },

    async insertItemNovo(param: iInsertItemNovoParam) {
        try {
            state.loading = true;

            param.ID_REQUISICAO_COMPRA = state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA;

            const data = await requisicaoCompraService.insertItemNovo(param);

            state.modalNovoItemOpened = false

            if (data.success) {
                state.dbRequisicaoItens.push({
                    ...param,
                    ID_REQUISICAO_COMPRA_ITEM: data.ID_REQUISICAO_COMPRA_ITEM
                })
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao adicionar um novo item.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async updateItemNovo(param: iItemToEdit) {
        try {
            state.loading = true;

            const data = await requisicaoCompraService.updateItemNovo(param);

            if (data.success) {
                const itemIndex = state.dbRequisicaoItens.findIndex(
                    (item: iRequisicaoItem) => item.ID_REQUISICAO_COMPRA_ITEM == param.ID_REQUISICAO_COMPRA_ITEM
                )

                if (itemIndex >= 0) {
                    state.dbRequisicaoItens[itemIndex] = { ...param }
                }
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao atualizar o item.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    }
}

export const computeds = {
    totalizador: computed(() => {
        if (state.dbRequisicaoItens.length > 0) {
            let valorTotalItens = state.dbRequisicaoItens.reduce((total, item) => total + item.TOTAL, 0)

            state.dbRequisicaoCompra.VALOR = valorTotalItens

            return valorTotalItens
        }

        return 0
    })
}