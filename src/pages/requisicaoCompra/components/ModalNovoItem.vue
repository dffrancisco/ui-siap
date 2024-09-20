<script lang="ts" setup>
import { onMounted, onUnmounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import serviceRequisicaoCompra from "../services/requisicaoCompra.service";
import Swal from "sweetalert2";
import { iCarros, iMarcas } from "../interfaces";
import { useEventListener } from "@vueuse/core";

const state = reactive({
  gridProdutos: <ixGridCreate>{},
  loading: false,
  dbMarcas: <iMarcas[]>[],
  dbCarros: <iCarros[]>[],
  selectMarca: null,
  selectCarro: null,
  inputSearch: <HTMLInputElement>null,
});

const actions = {
  criarGrid() {
    state.gridProdutos = new xGridV2.create({
      el: "#gridProdutos",
      columns: {
        "": {},
      },
      height: "310px",
    });
  },

  async init() {
    state.inputSearch = document.getElementById("inputSearch") as HTMLInputElement;

    actions.criarGrid();
    await actions.getDadosToSelectProduto();
  },

  async getDadosToSelectProduto() {
    try {
      state.loading = true;
      const { marcas, carros } = await serviceRequisicaoCompra.getDadosToSelectProduto();

      state.dbMarcas = marcas;
      state.dbCarros = carros;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocorreu um erro ao carregar as marcas e carros.",
        text: error.message,
      });
    } finally {
      state.loading = false;
    }
  },
};

onMounted(async () => {
  actions.init();
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.inputSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});
</script>

<template>
  <v-card class="d-flex flex-grow-1 pa-4">
    <v-card-title>Novo Item</v-card-title>

    <div class="mt-2">
      <v-row>
        <v-col cols="3">
          <v-autocomplete
            v-model="state.selectCarro"
            :items="state.dbCarros"
            label="Carro"
            item-title="DESCRICAO"
            item-value="ID_CARRO"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="state.selectMarca"
            :items="state.dbMarcas"
            item-title="DESCRICAO"
            item-value="ID_MARCA"
            label="Marca"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="d-flex align-center ga-2">
          <v-text-field
            id="inputSearch"
            label="F1 - Pesquisar (N° Fab. ou Descrição)"
            @keydown.enter="() => {}"
            @keydown.arrow.down.prevent="() => {}"
          ></v-text-field>
          <v-btn
            icon="mdi-magnify mdi-24px"
            color="primary"
            size="36"
            @click="() => {}"
          />
        </v-col>
      </v-row>
    </div>

    <div
      id="gridProdutos"
      class="mt-4"
    ></div>

    <div class="d-flex justify-space-between">
      <div>
        <v-btn color="primary">+ ITEM SEM CADASTRO</v-btn>
      </div>

      <div class="d-flex ga-4">
        <v-btn
          variant="outlined"
          color="primary"
          @click="() => {}"
          >Cancelar</v-btn
        >
        <v-btn
          color="primary"
          @click="() => {}"
          >selecionar</v-btn
        >
      </div>
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
