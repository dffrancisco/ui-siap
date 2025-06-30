<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import modalConfirmar from "./components/modalConfirmar.vue";
import {state,actions} from './desbloqueioCredito'

</script>

<template>
  <v-container class=" d-flex flex-column ga-3 bg-white rounded-lg ">
    <h2 class="">LIBERAR CRÉDITO MANUAL</h2>

    <h3>Chave</h3>

    <section class=" d-flex flex-column ga-4">

      <div class="d-flex div-pai ga-5 ">

        <v-text-field 
        class="input-chave"
        v-model="state.pesquisaCredito"
        > </v-text-field>

        <v-btn @click="actions.getCredito(state.pesquisaCredito)" icon="" density="comfortable">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <h3>Dados do Crédito:</h3>

      <div class=" d-flex flex-column ga-4 ">

        <div class=" div-paragrafo d-flex align-itens-center justify-space-around pa-4 border rounded-lg
        " v-for="valor in state.listaDadosCredito">
          <p class="text-subtitle-2">Chave: {{ valor.CHAVE }}</p>
          <p class="text-subtitle-2">Cpf: {{ valor.CPF_CNPJ }}</p>
          <p class="text-subtitle-2">Valor: {{ valor.VALOR}}</p>
          <p class="text-subtitle-2">Bloqueado: {{ valor.BLOQUEADO}}</p>
        </div>

        <div class=" d-flex justify-end">
          <v-btn class="bg-blue"> desbloquear crédito</v-btn>
        </div>
      </div>

    </section>
  </v-container>

  <v-dialog>
    <modalConfirmar>
    </modalConfirmar>
  </v-dialog>
</template>

<style scoped>
.input-chave {
  max-width: 20%;
  height: 2rem;
}
</style>
