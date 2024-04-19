<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { nextTick, reactive, computed, watch } from "vue";
import { iProdutoObj } from "../interfaces";
import { MAP_COL_PRODUTO } from "../constants/constants";
import utils from "@/ts/utils";

const props = defineProps({
  objProdutos: {
    type: Object as () => iProdutoObj,
    default: {},
  },
  keysProdutos: {
    type: Array as () => string[],
    default: [],
  },
  indexProdutoSelecionado: {
    type: Number,
    default: 0,
  },
  qtdProdutosAdicionados: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["changeIndexProdutoSelecionado"]);

const state = reactive({
  gridItens: <ixGridCreate>{},
});

const produtos = computed(() => {
  return Object.values(props.objProdutos);
});

watch(
  () => [props.keysProdutos, props.qtdProdutosAdicionados],
  () => {
    state.gridItens.source(produtos.value);
    state.gridItens.focus(props.indexProdutoSelecionado);
  }
);

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
        Descrição: { dataField: MAP_COL_PRODUTO.DESC_PRODUTO },
        "Nº Fabricante": { dataField: MAP_COL_PRODUTO.NUM_FABRICANTE, width: "14%" },
        Carro: { dataField: MAP_COL_PRODUTO.DESCRICAO_CARRO, width: "14%" },
        Marca: { dataField: MAP_COL_PRODUTO.DESCRICAO_MARCA, width: "14%" },
        "Qtd. Est": { dataField: MAP_COL_PRODUTO.QUANTIDADE, center: true, width: "10%" },
        Custo: { dataField: MAP_COL_PRODUTO.CUSTO, center: true, render: utils.formatValor, width: "10%" },
      },
      onSelectLine: (dados) => {
        let indexProdutoSelecionado = props.keysProdutos.findIndex(
          (keyProduto) => keyProduto == dados[MAP_COL_PRODUTO.COD_PRODUTO]
        );

        emit("changeIndexProdutoSelecionado", indexProdutoSelecionado);
      },
    });

    state.gridItens.source(produtos.value);
    state.gridItens.focus(props.indexProdutoSelecionado);
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
