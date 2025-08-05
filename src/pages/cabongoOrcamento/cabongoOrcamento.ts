import { computed, reactive } from "vue";
import cabongoOrcamentoService from "./service/cabongoOrcamento.service";
import { iOrcamento, iOrcamentoLoja, iOrcamentosObj } from "./interface";

export const state = reactive({
    objOrcamentoLoja: <iOrcamentoLoja>{},
    id_sociedade: 0,
    meuCNPJ: '',
    dataOrcamento: '',
    modalAlterarProdutoOpened: false,
    modalAdicionarItemOpened: false
})


export const computeds = {
    orcamento: computed<iOrcamento[]>(() => {
        return Object.values(state.objOrcamentoLoja.orcamentosObj || {})
    })
}

export const actions = {
    async init() {
        await actions.getOrcamentoLoja()
        await actions.getQuantidadeProduto()
    },

    async(data: {
        endEstoque: string;
        endExcessao: string;
        quantidade: number;
        acao: string;
    }) {

    },

    async modalAlterarProdutoOpened() {
        state.modalAlterarProdutoOpened = true
    },
    async modalAdicionarItemOpened() {
        state.modalAdicionarItemOpened = true
    },

    async getOrcamentoLoja() {
        state.objOrcamentoLoja = await cabongoOrcamentoService.getOrcamentoLoja({
            id_sociedade: state.id_sociedade,
            cnpj: state.meuCNPJ,
            dataOrcamento: state.dataOrcamento
        })
    },

    async getQuantidadeProduto() {

        const orcamentosObj = state.objOrcamentoLoja.orcamentosObj;
        const todosItens = Object.values(orcamentosObj).flatMap(orcamento => orcamento.itens);

        const codProdutos = Object.values(orcamentosObj).flatMap(orcamento =>
            orcamento.itens.map(item => item.COD_PRODUTO)
        );
        const quantidadeProdutos = await cabongoOrcamentoService.getQuantidadeProduto({
            cod_produto: codProdutos
        })



        todosItens.forEach((item, index) => {
            const dados = quantidadeProdutos[index];
            if (dados) {
                item.QUANTIDADE_ESTOQUE = dados.QUANTIDADE ?? 0;
                item.END_ESTOQUE = dados.END_ESTOQUE ?? '';
            }
        });
        state.objOrcamentoLoja = {
            ...state.objOrcamentoLoja,
            orcamentosObj: {
                ...orcamentosObj
            }
        };
    },

}