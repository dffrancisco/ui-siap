<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";

const state = reactive({
  gridProdutos: <ixGridCreate>{},
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
};

onMounted(() => {
  actions.criarGrid();
});
</script>

<template>
  <v-card class="d-flex flex-grow-1 pa-4">
    <v-card-title>Novo Item</v-card-title>

    <div class="mt-2">
      <v-row>
        <v-col cols="3">
          <v-select label="Carro"> </v-select>
        </v-col>
        <v-col cols="3">
          <v-select label="Marca"> </v-select>
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
</template>
