<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { nextTick, reactive, computed, watch } from "vue";
import { iParamEmitAdicionarItem, iProdutoAdicionadoObj, iProdutoObj } from "../interfaces";
import { MAP_COL_PRODUTO } from "../constants/constants";
import ModalAdicionarItem from "./ModalAdicionarItem.vue";

const props = defineProps({
  idCompras: {
    type: Number,
    default: undefined,
  },
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
  indexProdutoSelecionado: {
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

const emit = defineEmits(["changeIndexProdutoSelecionado", "adicionarItem", "deletarItem"]);

const state = reactive({
  gridItensAdicionados: <ixGridCreate>{},
  modalAdicionarItemOpened: false,
  loading: false,
});

const produtos = computed(() => {
  return Object.values(props.objProdutosAdicionados);
});

watch(
  () => props.objProdutosAdicionados,
  async () => {
    state.gridItensAdicionados.source(produtos.value);

    await nextTick();

    actions.focarLinhaGrid();
  },
  {
    deep: true,
  }
);

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
        Total: { dataField: "TOTAL", compare: "total", width: "10%" },
      },
      compare: {
        total(r) {
          return utils.formatValor(r.PEDIDO_CUSTO_ADICIONADO * r.PEDIDO_QTD_ADICIONADA);
        },
      },
      onSelectLine: (dados) => {
        let indexProdutoSelecionadoGrid = props.keysProdutos.findIndex(
          (keyProduto) => keyProduto == dados.COD_PRODUTO
        );

        emit("changeIndexProdutoSelecionado", indexProdutoSelecionadoGrid);
      },
      onKeyDown: {
        13: (dados) => {
          state.modalAdicionarItemOpened = true;
        },
        46: (dados, e) => {
          utils.confirma({
            msg: "Deseja realmente deletar o item do pedido?",
            theme: "xModal-dark-square",
            call: async () => {
              emit("deletarItem", dados[MAP_COL_PRODUTO.COD_PRODUTO]);
              state.gridItensAdicionados.deleteLine();
              state.gridItensAdicionados.focus(1);
            },
          });
        },
      },
    });

    state.gridItensAdicionados.source(produtos.value);
    state.gridItensAdicionados.focus();
  },

  async focarLinhaGrid() {
    await nextTick();

    let keyProdutoSelecionado = props.keysProdutos[props.indexProdutoSelecionado];
    let linhaParaFocar = Object.keys(props.objProdutosAdicionados).findIndex(
      (keyProduto) => keyProduto == keyProdutoSelecionado
    );

    console.log(linhaParaFocar, keyProdutoSelecionado);
    state.gridItensAdicionados.focus(linhaParaFocar);
  },

  adicionarItem(param: iParamEmitAdicionarItem) {
    emit("adicionarItem", param);
    state.modalAdicionarItemOpened = false;
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

    <v-dialog
      v-model="state.modalAdicionarItemOpened"
      max-width="350px"
      transition="dialog-transition"
      @update:modelValue="actions.focarLinhaGrid"
    >
      <ModalAdicionarItem
        :qtdAtual="produtos[indexProdutoSelecionado][MAP_COL_PRODUTO.QUANTIDADE]"
        :valorVenda="produtos[indexProdutoSelecionado][MAP_COL_PRODUTO.VENDA]"
        :valorCusto="produtos[indexProdutoSelecionado][MAP_COL_PRODUTO.CUSTO]"
        :media="media"
        :corMediaVenda="corMediaVenda"
        @adicionarItem="actions.adicionarItem"
      />
    </v-dialog>

    <v-overlay
      :model-value="state.loading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
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
