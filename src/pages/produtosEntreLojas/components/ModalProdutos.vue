<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { iLojaFormatada, iLojaLista, iProduto, iFilterSearch } from "../interfaces";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import ModalOrcamentos from "./ModalOrcamentos.vue";

const props = defineProps({
  lojaSelecionada: {
    type: Object as () => iLojaFormatada,
    default: [],
  },
  lojaOrigem: {
    type: Object as () => iLojaLista,
    default: {},
  },
  filterSearch: {
    type: Object as () => iFilterSearch,
  },
});

const emits = defineEmits(["closeModal"]);

const state = reactive({
  gridProdutos: <ixGridCreate>{},
  modalOrcamentosOpened: false,
  produtoSelecionado: <iProduto>{},
});

const actions = {
  async init() {
    await actions.criarGrid();
    state.gridProdutos.source(props.lojaSelecionada.PRODUTOS);
  },

  criarGrid() {
    state.gridProdutos = new xGridV2.create({
      el: "#gridProdutos",
      count: true,
      height: 370,
      columns: {
        "N° Fabricante": {
          dataField: "NUM_FABRICANTE",
        },
        Descrição: {
          dataField: "DESC_PRODUTO",
          width: "70%",
        },
        Quantidade: {
          dataField: "QTD",
          width: "10%",
          center: true,
        },
      },
      dblClick: async () => {
        await actions.openModalOrcamentos();
      },
    });
  },

  async openModalOrcamentos() {
    state.produtoSelecionado = state.gridProdutos.dataSource();
    state.modalOrcamentosOpened = true;
  },
};

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-card height="500">
    <div>
      <v-card-title class="d-flex justify-space-between">
        <span>{{ props.lojaOrigem.NOME }} - PRODUTOS COMPRADOS ({{ props.lojaSelecionada.LOJA }})</span>
        <v-icon @click="emits('closeModal')">mdi-close</v-icon>
      </v-card-title>
    </div>

    <v-divider></v-divider>

    <div class="pa-4 d-flex flex-column flex-grow-1">
      <div id="gridProdutos"></div>

      <div class="d-flex mt-4 ga-2 justify-end align-end flex-grow-1">
        <v-btn
          color="primary"
          variant="outlined"
          @click="emits('closeModal')"
          >fechar</v-btn
        >
        <v-btn color="primary"><v-icon class="mr-2">mdi-printer</v-icon>imprimir</v-btn>
      </div>
    </div>
  </v-card>

  <v-dialog
    v-model="state.modalOrcamentosOpened"
    max-width="580"
  >
    <ModalOrcamentos
      :loja-origem="props.lojaOrigem"
      :loja="props.lojaSelecionada"
      :filter-search="props.filterSearch"
      :cod-produto="state.produtoSelecionado.COD_PRODUTO"
      @close-modal="state.modalOrcamentosOpened = false"
    />
  </v-dialog>
</template>
