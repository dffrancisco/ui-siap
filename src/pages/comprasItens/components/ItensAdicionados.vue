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
  qtdJaAdicionada: {
    type: Number,
    default: 0,
  },
  isAlteracao: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["changeIndexProdutoSelecionado", "adicionarItem", "deletarItem"]);

const state = reactive({
  gridItensAdicionados: <ixGridCreate>{},
  modalAdicionarItemOpened: false,
  loading: false,
  qtdAlterado: 0,
});

const produtos = computed(() => {
  return Object.values(props.objProdutosAdicionados);
});

watch(
  () => props.objProdutosAdicionados,
  async () => {
    if (props.isAlteracao) {
      state.gridItensAdicionados.dataSource({
        ...state.gridItensAdicionados.dataSource(),
        PEDIDO_QTD_ADICIONADA: state.qtdAlterado,
      });

      return;
    }

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
        Qtd: { dataField: "PEDIDO_QTD_ADICIONADA", center: true, width: "10%", style: "font-size: 12px" },
        Custo: {
          dataField: "PEDIDO_CUSTO_ADICIONADO",
          center: true,
          render: utils.formatValor,
          width: "10%",
          style: "font-size: 12px",
        },
        Total: { dataField: "TOTAL", compare: "total", width: "10%", style: "font-size: 12px" },
        Carro: { dataField: MAP_COL_PRODUTO.DESCRICAO_CARRO, width: "14%", style: "font-size: 12px" },
        Marca: { dataField: MAP_COL_PRODUTO.DESCRICAO_MARCA, width: "14%", style: "font-size: 12px" },
      },
      compare: {
        total(r) {
          return utils.formatValor(r.PEDIDO_CUSTO_ADICIONADO * r.PEDIDO_QTD_ADICIONADA);
        },
        formatarDescricaoProduto: (r) => {
          return `<div class="descricaoContainer-itensAdicionados">
                    <span>${r[MAP_COL_PRODUTO.DESC_PRODUTO]}</span>
                  </div>`;
        },
        agruparNumeroFabricante: (r) => {
          return `<div class="numFabContainer-itensAdicionados">
                    <span>${r[MAP_COL_PRODUTO.NUM_FABRICANTE]}</span>
                    <span>${r[MAP_COL_PRODUTO.NUM_FABRICANTE2]}</span>
                  </div>`;
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
        // tecla '1' e '->'
        97: () => actions.proximoItem(),
        39: () => actions.proximoItem(),

        // tecla '3 e '<-''
        99: () => actions.itemAnterior(),
        37: () => actions.itemAnterior(),
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

    state.gridItensAdicionados.focus(linhaParaFocar);
  },

  adicionarItem(param: iParamEmitAdicionarItem) {
    state.qtdAlterado = param.qtd;

    param = {
      ...param,
      isAlteracao: true,
    };

    emit("adicionarItem", param);
    state.modalAdicionarItemOpened = false;
  },

  proximoItem() {
    let linhaGrid = Number(state.gridItensAdicionados.getIndex());
    //@ts-ignore
    let qtdItensGrid = state.gridItensAdicionados.data().length;

    let proximoItem = linhaGrid + 1;

    if (proximoItem > qtdItensGrid) {
      proximoItem = qtdItensGrid;
    }

    state.gridItensAdicionados.focus(proximoItem);
  },

  itemAnterior() {
    let linhaGrid = Number(state.gridItensAdicionados.getIndex());

    let itemAnterior = linhaGrid - 1;

    if (itemAnterior < 0) {
      itemAnterior = 0;
    }

    state.gridItensAdicionados.focus(itemAnterior);
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
        :qtdAtual="objProdutos[keysProdutos[indexProdutoSelecionado]][MAP_COL_PRODUTO.QUANTIDADE]"
        :valorVenda="objProdutos[keysProdutos[indexProdutoSelecionado]][MAP_COL_PRODUTO.VENDA]"
        :valorCusto="objProdutos[keysProdutos[indexProdutoSelecionado]][MAP_COL_PRODUTO.CUSTO]"
        :qtdAdicionada="qtdJaAdicionada"
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

.numFabContainer-itensAdicionados {
  display: flex;
  flex-direction: column;
}
.descricaoContainer-itensAdicionados {
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
