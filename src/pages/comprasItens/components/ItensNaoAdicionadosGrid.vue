<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { nextTick, reactive, computed } from "vue";
import {
  iParamEmitAdicionarItem,
  iProdutoAdicionadoObj,
  iProdutoNaoAdicionadoGrid,
  iProdutoObj,
} from "../interfaces";
import { MAP_COL_PRODUTO } from "../constants/constants";
import { getColorDescricao } from "../services/comprasItens.service";
import ModalAdicionarItem from "./ModalAdicionarItem.vue";

const props = defineProps({
  objProdutos: {
    type: Object as () => iProdutoObj,
    default: {},
  },
  objProdutosAdicionados: {
    type: Object as () => iProdutoAdicionadoObj,
    default: {},
  },
  keysProdutos: {
    type: Array as () => string[],
    default: [],
  },
  qtdJaAdicionada: {
    type: Number,
    default: 0,
  },
  indexProdutoSelecionado: {
    type: Number,
    default: 0,
  },
  qtdProdutosAdicionados: {
    type: Number,
    default: 0,
  },
  media: {
    type: Number,
    default: 0,
  },
  corMediaVenda: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["changeIndexProdutoSelecionado", "adicionarItem"]);

const state = reactive({
  gridItens: <ixGridCreate>{},
  modalAdicionarItemOpened: false,
});

const produtos = computed(() => {
  let produtosTratados: iProdutoNaoAdicionadoGrid[] = [];
  for (let keyProduto in props.objProdutos) {
    produtosTratados.push({
      ...props.objProdutos[keyProduto],
      ...props.objProdutosAdicionados[keyProduto],
    });
  }

  return produtosTratados;
});

const actions = {
  init: () => {
    actions.initGrids();
  },
  initGrids: () => {
    state.gridItens = new xGridV2.create({
      el: "#gridItens",
      //@ts-ignore
      theme: "x-modern-dark",
      height: "240px",
      columns: {
        "Nº Fabricante": {
          dataField: MAP_COL_PRODUTO.NUM_FABRICANTE,
          width: "14%",
          compare: "agruparNumeroFabricante",
          style: "font-size: 12px",
        },
        Descrição: {
          dataField: MAP_COL_PRODUTO.DESC_PRODUTO,
          compare: "formatarDescricaoProduto",
          style: "font-size: 12px",
        },
        "Qtd. Est": {
          dataField: MAP_COL_PRODUTO.QUANTIDADE,
          center: true,
          width: "10%",
          style: "font-size: 12px",
        },
        Custo: {
          dataField: MAP_COL_PRODUTO.CUSTO,
          center: true,
          render: utils.formatValor,
          width: "10%",
          style: "font-size: 12px",
        },
        Carro: { dataField: MAP_COL_PRODUTO.DESCRICAO_CARRO, width: "14%", style: "font-size: 12px" },
        Marca: { dataField: MAP_COL_PRODUTO.DESCRICAO_MARCA, width: "14%", style: "font-size: 12px" },
      },
      compare: {
        formatarDescricaoProduto: (r) => {
          let color = getColorDescricao(r["PEDIDO_QTD_ADICIONADA"], r[MAP_COL_PRODUTO.PRODUTO_NOVO]);
          return `<div class="descricaoContainer-itensNaoAdicionadosGrid">
                    <span style='color: ${color}'>${r[MAP_COL_PRODUTO.DESC_PRODUTO]}</span>
                  </div>`;
        },
        agruparNumeroFabricante: (r) => {
          return `<div class="numFabContainer-itensNaoAdicionadosGrid">
                    <span>${r[MAP_COL_PRODUTO.NUM_FABRICANTE]}</span>
                    <span>${r[MAP_COL_PRODUTO.NUM_FABRICANTE2]}</span>
                  </div>`;
        },
      },
      onSelectLine: (dados) => {
        actions.changeIndexProdutoSelecionado(dados[MAP_COL_PRODUTO.COD_PRODUTO]);
      },
      onKeyDown: {
        13: (dados) => {
          state.modalAdicionarItemOpened = true;
        },

        // tecla '1' e '->'
        97: () => actions.proximoItem(),
        39: () => actions.proximoItem(),

        // tecla '3 e '<-''
        99: () => actions.itemAnterior(),
        37: () => actions.itemAnterior(),
      },
    });

    state.gridItens.source(produtos.value);
    state.gridItens.focus(props.indexProdutoSelecionado);
  },
  changeIndexProdutoSelecionado(codProduto: string) {
    let indexProdutoSelecionado = props.keysProdutos.findIndex((keyProduto) => keyProduto == codProduto);

    emit("changeIndexProdutoSelecionado", indexProdutoSelecionado);
  },
  async focarLinhaGrid() {
    await nextTick();
    state.gridItens.focus(props.indexProdutoSelecionado);
  },
  adicionarItem(param: iParamEmitAdicionarItem) {
    emit("adicionarItem", param);
    state.modalAdicionarItemOpened = false;
    setTimeout(() => {
      actions.focarLinhaGrid();
    }, 100);
  },
  proximoItem() {
    let linhaGrid = Number(state.gridItens.getIndex());
    //@ts-ignore
    let qtdItensGrid = state.gridItens.data().length;

    let proximoItem = linhaGrid + 1;

    if (proximoItem > qtdItensGrid) {
      proximoItem = qtdItensGrid;
    }

    state.gridItens.focus(proximoItem);
  },
  itemAnterior() {
    let linhaGrid = Number(state.gridItens.getIndex());

    let itemAnterior = linhaGrid - 1;

    if (itemAnterior < 0) {
      itemAnterior = 0;
    }

    state.gridItens.focus(itemAnterior);
  },
};

nextTick(() => {
  actions.init();
});
</script>

<template>
  <div class="itens">
    <div
      id="gridItens"
      class="grid-itens"
    ></div>

    <v-dialog
      v-model="state.modalAdicionarItemOpened"
      max-width="350px"
      transition="dialog-transition"
      @update:modelValue="actions.focarLinhaGrid"
    >
      <ModalAdicionarItem
        :qtdAtual="produtos[indexProdutoSelecionado][MAP_COL_PRODUTO.QUANTIDADE]"
        :qtdAdicionada="qtdJaAdicionada"
        :valorVenda="produtos[indexProdutoSelecionado][MAP_COL_PRODUTO.VENDA]"
        :valorCusto="produtos[indexProdutoSelecionado][MAP_COL_PRODUTO.CUSTO]"
        :media="media"
        :corMediaVenda="corMediaVenda"
        @adicionarItem="actions.adicionarItem"
      />
    </v-dialog>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
}
::-webkit-scrollbar-track-piece {
  background-color: #000;
}
::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #666;
  border-radius: 3px;
}

.numFabContainer-itensNaoAdicionadosGrid {
  display: flex;
  flex-direction: column;
}
.descricaoContainer-itensNaoAdicionadosGrid {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>

<style lang="scss" scoped>
.itens {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 792px;
  height: 100%;
  background-color: var(--grey-900);
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 8px;
}
</style>
