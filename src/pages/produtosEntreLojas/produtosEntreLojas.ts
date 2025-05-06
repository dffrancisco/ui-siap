import moment from "moment";
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import produtosEntreLojasService from "./services/produtosEntreLojas.service";
import { iGetProdutosEntreLojasResponse, iLojaFormatada, iLoja, iFilterSearch } from "./interfaces";
import utils from "@/ts/utils";

export const state = reactive({
    filterSearch: <iFilterSearch>{
        loja: 10,
        mes: moment().month() + 1,
        ano: moment().year()
    },
    setFilterSearch: <iFilterSearch>{},
    loading: false,
    lojas: <iLoja[]>[],
    gridPrincipal: <ixGridCreate>{},
    loadingLojas: false,
    modalProdutosOpened: false,
    modalOrcamentosOpened: false,
    dbLojaSelecionada: <iLojaFormatada>{},
    lojaOrigem: <iLoja>{},
    btnPrintDisable: true
})

export const actions = {
    async init() {
        await actions.createGrid()
        await actions.getLojas()
    },

    async createGrid() {
        state.gridPrincipal = new xGridV2.create({
            el: '#gridPrincipal',
            height: 415,
            count: false,
            columns: {
                Lojas: { dataField: 'LOJA', width: '80%' },
                Valores: { dataField: 'VALOR_TOTAL', right: true }
            },
            dblClick: () => {
                actions.openModalProdutos()
            },
            enter: () => {
                actions.openModalProdutos()
            }
        })
    },

    async onClickBtnSearch() {
        if (!state.filterSearch.loja) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecione uma Loja.'
            })

            return
        }

        if (!state.filterSearch.mes) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecione um mês.'
            })

            return
        }

        if (state.filterSearch.ano.toString().length < 4) {
            Swal.fire({
                icon: 'warning',
                title: 'Ano inválido.'
            })

            return
        }

        if (moment({ month: state.filterSearch.mes - 1, year: state.filterSearch.ano }).isAfter(moment())) {
            Swal.fire({
                title: 'Insira uma data válida.',
                icon: 'warning'
            })

            return
        }

        state.loadingLojas = true

        state.setFilterSearch = state.filterSearch

        const lojasFiltradas = state.lojas.filter(loja =>
            loja.ID_SOCIEDADE != state.filterSearch.loja && loja.ID_SOCIEDADE != 6
        )

        const qtdLojas = lojasFiltradas.length

        state.lojaOrigem = state.lojas.find(loja => loja.ID_SOCIEDADE == state.filterSearch.loja)

        state.gridPrincipal.clear()
        state.gridPrincipal.disable()

        for (let i = 0; i < qtdLojas; i += 3) {
            const grupoLojas = lojasFiltradas.slice(i, i + 3).map(loja => loja.ID_SOCIEDADE)

            await actions.getProdutosEntreLojas(grupoLojas, state.lojaOrigem.CGC_CLIENTE)
        }

        state.gridPrincipal.enable()

        await actions.totalizarValoresLojas()

        state.loadingLojas = false
    },

    async totalizarValoresLojas() {
        //@ts-ignore
        let lojas: iLojaFormatada[] = state.gridPrincipal.data()

        if (lojas.length > 0) {

            state.btnPrintDisable = false

            let total = lojas.reduce((total, loja) => {
                if (utils.formatValorUSA(loja.VALOR_TOTAL) > 0) {
                    return total + utils.formatValorUSA(loja.VALOR_TOTAL);
                }
            }, 0);

            state.gridPrincipal.sourceAdd([{
                LOJA: 'TOTAL',
                VALOR_TOTAL: utils.formatValor(total)
            }])
        }
    },

    async openModalProdutos() {
        let loja = state.gridPrincipal.dataSource()

        if (loja.LOJA == 'TOTAL') {
            return
        }

        if (!loja.PRODUTOS || loja.PRODUTOS.length <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Loja Offline.'
            })

            return
        }

        state.dbLojaSelecionada = loja
        state.modalProdutosOpened = true
    },

    async getLojas() {
        try {
            state.loading = true

            const data = await produtosEntreLojasService.getLojas()

            state.lojas = data

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error ao buscar as lojas.',
                icon: 'error'
            })
        } finally {
            state.loading = false
        }
    },

    formatarPorLojas(obj: iGetProdutosEntreLojasResponse, lojas: iLoja[]): iLojaFormatada[] {
        const resultado = [];

        for (const idLoja in obj) {

            const dadosLoja = obj[idLoja];

            const lojaEncontrada = lojas.find(loja => String(loja.ID_SOCIEDADE) === idLoja);

            if (lojaEncontrada) {
                if (dadosLoja?.error) {
                    resultado.push({
                        LOJA: lojaEncontrada.NOME,
                        VALOR_TOTAL: dadosLoja.msg,
                        PRODUTOS: [],
                        ID_SOCIEDADE: idLoja
                    });
                } else {
                    resultado.push({
                        LOJA: lojaEncontrada.NOME,
                        VALOR_TOTAL: dadosLoja?.valorTotalProdutos ? utils.formatValor(dadosLoja.valorTotalProdutos) : 'Loja Offline',
                        PRODUTOS: dadosLoja?.produtos ?? [],
                        ID_SOCIEDADE: idLoja
                    });
                }
            }
        }

        return resultado;
    },

    async getProdutosEntreLojas(lojas: number[], cnpjLojaFiltrada: string) {
        try {

            let data = await produtosEntreLojasService.getProdutosEntreLojas({
                CNPJ: cnpjLojaFiltrada,
                ANO: state.filterSearch.ano,
                MES: state.filterSearch.mes
            }, lojas)

            const lojasFormatadas = actions.formatarPorLojas(data, state.lojas)

            state.gridPrincipal.sourceAdd(lojasFormatadas)
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error ao buscar os produtos entre lojas.'
            })
        }
    }
}