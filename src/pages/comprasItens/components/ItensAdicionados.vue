<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { nextTick, reactive, computed } from "vue";
import { iProdutoAdicionadoObj, iProdutoObj, iProdutoAdicionadoGrid } from "../interfaces";
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
  objProdutosAdicionados: {
    type: Object as () => iProdutoAdicionadoObj,
    default: {},
  },
});

const emit = defineEmits(["changeIndexProdutoSelecionado"]);

const state = reactive({
  gridItensAdicionados: <ixGridCreate>{},
});

const produtos = computed(() => {
  let produtos = [] as iProdutoAdicionadoGrid[];

  Object.keys(props.objProdutosAdicionados).forEach((keyProduto) => {
    produtos.push({
      ...props.objProdutos[keyProduto],
      COD_PRODUTO: parseInt(keyProduto),
      PEDIDO_QTD_ADICIONADA: props.objProdutosAdicionados[keyProduto].QUANTIDADE,
      PEDIDO_CUSTO_ADICIONADO: props.objProdutosAdicionados[keyProduto].CUSTO,
    });
  });

  return produtos;
});

const actions = {
  init: () => {
    actions.initGrids();
  },
  initGrids: () => {
    state.gridItensAdicionados = new xGridV2.create({
      el: "#gridItensAdicionados",
      //@ts-ignore
      theme: "x-modern-dark",
      height: "370px",
      columns: {
        "Nº Fabricante": { dataField: MAP_COL_PRODUTO.NUM_FABRICANTE, width: "14%" },
        Descrição: { dataField: MAP_COL_PRODUTO.DESC_PRODUTO },
        Carro: { dataField: MAP_COL_PRODUTO.DESCRICAO_CARRO, width: "14%" },
        Marca: { dataField: MAP_COL_PRODUTO.DESCRICAO_MARCA, width: "14%" },
        Qtd: { dataField: "PEDIDO_QTD_ADICIONADA", center: true, width: "10%" },
        Custo: { dataField: "PEDIDO_CUSTO_ADICIONADO", center: true, render: utils.formatValor, width: "10%" },
      },
      onSelectLine: (dados) => {
        let indexProdutoSelecionado = props.keysProdutos.findIndex(
          (keyProduto) => keyProduto == dados.COD_PRODUTO
        );

        emit("changeIndexProdutoSelecionado", indexProdutoSelecionado);
      },
    });

    state.gridItensAdicionados.source(produtos.value);
    state.gridItensAdicionados.focus();
  },
};

nextTick(() => {
  actions.init();
});
</script>

<template>
  <div class="itens-adicionados">
    <div
      id="gridItensAdicionados"
      class="grid-itens-adicionados"
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
.itens-adicionados {
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
