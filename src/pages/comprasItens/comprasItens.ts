import { computed, reactive } from 'vue'
import { iAbaHistorico, iAbaItens, iCabecalhoCompra, iHistoricoMes, iTipoVisualizacao, iUltimaCompra, iUltimaVenda } from './interfaces';

export const state = reactive(({
    loading: false,
    cabecalho: <iCabecalhoCompra>{
        ID_COMPRAS: 123,
        COMPRADOR: 'Guilherme',
        DATA: '2024-01-01',
        ID_MARCA_PRINCIPAL: 1,
        MARCA_PRINCIPAL: 'MAGNETI MARELLI',
        MARCAS: [{ ID_MARCA: 123 }, { ID_MARCA: 456 }],
        OBS: 'Essa marca atrasa muito o pedido então devemos ficar no pé deles testee pedido então devemos ficar no pé deles Essa marca atrasa muito o pedido então devemos ficar no pé deles testee pedido então devemos ficar no pé deles testeepedido então devemos ficar no pé deles testee',
        QTD_ITENS: 200,
        VALOR: 2500.25,
    },
    edtNumFabricante: undefined,
    edtDescricao: undefined,
    edtCarro: undefined,
    edtMarca: undefined,
    historicoMesesVenda: <iHistoricoMes[]>[],
    historicoMesesCompra: <iHistoricoMes[]>[],
    ultimasVendas: <iUltimaVenda[]>[
        { NUM_ORCAMENTO: 123, DATA: '2024-01-03', CLIENTE: 'FULANINHO DA SILVA FERREIRAAAAA AAA', QTD: 520, VALOR: 200.5, VENDEDOR: 'JÚLIO', MESMO_GRUPO: 0 },
        { NUM_ORCAMENTO: 123, DATA: '2024-01-03', CLIENTE: 'FULANINHO DA SILVA FERREIRA', QTD: 5, VALOR: 200.5, VENDEDOR: 'JÚLIO', MESMO_GRUPO: 0 },
        { NUM_ORCAMENTO: 123, DATA: '2024-01-03', CLIENTE: 'FULANINHO DA SILVA FERREIRA', QTD: 5, VALOR: 200.5, VENDEDOR: 'JÚLIO', MESMO_GRUPO: 1 },
        { NUM_ORCAMENTO: 123, DATA: '2024-01-03', CLIENTE: 'FULANINHO DA SILVA FERREIRA', QTD: 5, VALOR: 200.5, VENDEDOR: 'JÚLIO', MESMO_GRUPO: 0 },
        { NUM_ORCAMENTO: 123, DATA: '2024-01-03', CLIENTE: 'FULANINHO DA SILVA FERREIRA', QTD: 5, VALOR: 200.5, VENDEDOR: 'JÚLIO', MESMO_GRUPO: 0 },
    ],
    ultimasCompras: <iUltimaCompra[]>[
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRAAAAA AAA', QTD: 520, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 1 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
    ],
    abaHistorico: <iAbaHistorico>'vendas',
    abaItens: <iAbaItens>'nao_adicionados',
    tipoVisualizacaoItem: <iTipoVisualizacao>"unica",
}))

const historicoMesesDefault = [
    { mes: 'JAN', qtd: 0 },
    { mes: 'FEV', qtd: 0 },
    { mes: 'MAR', qtd: 0 },
    { mes: 'ABR', qtd: 0 },
    { mes: 'MAI', qtd: 0 },
    { mes: 'JUN', qtd: 0 },
    { mes: 'JUL', qtd: 0 },
    { mes: 'AGO', qtd: 0 },
    { mes: 'SET', qtd: 0 },
    { mes: 'OUT', qtd: 0 },
    { mes: 'NOV', qtd: 0 },
    { mes: 'DEZ', qtd: 0 },
]

export const actions = {
    init: async () => {
        state.historicoMesesVenda = [...historicoMesesDefault]
        state.historicoMesesCompra = [...historicoMesesDefault]
    },

    setAbaHistorico: (abaHistorico: iAbaHistorico) => {
        state.abaHistorico = abaHistorico;
    },

    setAbaItens: (abaItens: iAbaItens) => {
        state.abaItens = abaItens;
    },

    setTipoVisualizacaoItem: (tipoVisualizacaoItem: iTipoVisualizacao) => {
        state.tipoVisualizacaoItem = tipoVisualizacaoItem
    }
}

export const computeds = {
    historicoMeses: computed(() => {
        if (state.abaHistorico == 'compras') {
            return state.historicoMesesCompra
        }

        if (state.abaHistorico == 'vendas') {
            return state.historicoMesesVenda
        }

        return historicoMesesDefault
    })
}

export default { state, actions, computeds }