<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { iProdutos, iProdutosEscolhidos } from "../interfaces";

const props = defineProps<{
  produtos: iProdutos[];
  produtosEditar: iProdutosEscolhidos | null;
  modalOpened: boolean;
}>();

const state = reactive({
  loading: false,
  search: "",
  produtos: <iProdutos[]>[],
  selectedProdutos: <number[]>[],
  headers: <any>[
    { title: "Descrição", key: "DESC_PRODUTO", width: "240px" },
    { title: "Cód. Produto", key: "COD_PRODUTO" },
    { title: "Num. Fabricante", key: "NUM_FABRICANTE" },
  ],
});

const filtrarProdutos = computed(() => {
  if (!state.search) return props.produtos;

  return props.produtos.filter((produto) =>
    produto.DESC_PRODUTO.toLowerCase().includes(state.search.toLowerCase())
  );
});

const confirmarSelecionados = () => {
  let produtosEscolhidos = state.selectedProdutos;

  let primeiroProdutoEscolhido: number = produtosEscolhidos[0];
  const descricaoSelecionados = primeiroProdutoEscolhido
    ? props.produtos.find((produto) => produto.COD_PRODUTO == primeiroProdutoEscolhido)?.DESC_PRODUTO.split(" ")[0]
    : "Nenhuma descrição encontrada";

  let produtosSelecionados = {
    descricaoSelecionados,
    produtosEscolhidos,
  };

  emit("produtosEscolhidos", produtosSelecionados);
  emit("closeModal");
};

const cancelar = () => {
  emit("closeModal");
  state.selectedProdutos = [];
  state.search = "";
};

const emit = defineEmits(["produtosEscolhidos", "closeModal"]);

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.produtos = props.produtos;
      state.selectedProdutos = props.produtosEditar ? props.produtosEditar.produtosEscolhidos : [];
      state.search = "";
    }
  }
);
</script>

<template>
  <v-card>
    <v-card-title style="padding-bottom: 30px">
      <v-row>
        <div style="margin-left: 10px; width: 85%; padding-top: 20px">
          <v-text-field
            :clearable="true"
            v-model="state.search"
            label="Pesquisar"
          ></v-text-field>
        </div>
        <div style="margin-left: 20px; padding-top: 20px"
          ><v-btn
            icon
            size="small"
            color="primary"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn></div
        >
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="state.headers"
        :items="filtrarProdutos"
        items-per-page-text="Itens por página"
        height="455"
        item-key="COD_PRODUTO"
        item-value="COD_PRODUTO"
        show-select
        v-model="state.selectedProdutos"
        @keydown.enter.prevent="confirmarSelecionados"
      >
        <template #no-data>
          <v-alert
            :value="true"
            icon="mdi-information"
            style="background-color: #ffffff"
          >
            Não há dados disponíveis.
          </v-alert>
        </template>
      </v-data-table>
    </v-card-text>
    <div class="btns d-flex justify-end pb-4 mr-4">
      <v-btn
        style="color: #3680ab; border: 1px solid #3680ab"
        @click="cancelar"
        >Cancelar</v-btn
      >
      <v-btn
        class="ml-5"
        color="#3680AB"
        @click="confirmarSelecionados"
        >Selecionar</v-btn
      >
    </div>
  </v-card>

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
</template>

<style></style>
