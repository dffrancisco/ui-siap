<script setup lang="ts">
import { onMounted } from "vue";

import ModalAbrirCaixa from "./components/modalAbrirCaixa.vue";
import utils from "@/ts/utils";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import CardPrincipal from "./components/cardPrincipal.vue";
import { actions, state } from "./trocaVendedor";

function setBuscar(valor: string) {
  state.numOrcamento = valor
}

function getOrcamento() {
  actions.getOrcamento()
}
actions.init();
console.log(state.novoVendedor, "aqui")
</script>

<template >
  <v-app id="card">
  <v-container class="d-flex justify-center align-center ">
  <v-card
    color="blue-grey-lighten-4 mt-15"
    max-width="900"
    style="width: 100%;"

  >

    <CardPrincipal 
    :buscar="state.numOrcamento" 
    :vendedores="state.vendedores"
    :novo-vendedor="state.novoVendedor"
    @update:buscar="setBuscar" @pesquisar="getOrcamento" 
    :orcamento="state.orcamento"
    :avatar="`https://www.reallatas.com.br/foto_funcionarios/${state.orcamento.CPF}.jpg`"
    @trocar="actions.onClickTrocar"
    />
   
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
  <modalXAuthManager />
</v-container>

  </v-app>
</template>

<style scoped>

</style>
