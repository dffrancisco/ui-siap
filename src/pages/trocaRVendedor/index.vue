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

</script>

<template >
  <v-app id="card">
  <v-container class="d-flex justify-center align-center ">
  <v-card
    color="blue-grey-lighten-4 mt-15"
    class="py-3 px-3"
    max-width="1000"
    style="width: 100%;"

  >
    {{ state.numOrcamento }}
    <CardPrincipal :buscar="state.numOrcamento" @update:buscar="setBuscar" @pesquisar="getOrcamento" />
  </v-card>
</v-container>

  </v-app>
</template>

<style scoped>
#card{
  background-color: white;
  
}
</style>
