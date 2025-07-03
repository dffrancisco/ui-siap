<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import modalConfirmar from "./components/modalConfirmar.vue";
import utils, { swalDarkError, swalDarkSuccess } from '../../ts/utils'
import {state,actions} from './desbloqueioCredito'

</script>

<template>
  <v-container class="container  d-flex flex-column ga-3 bg-white rounded-lg ">
    <!-- <h2 class="">LIBERAR CRÉDITO MANUAL</h2> -->

    <h1 class="chave">Chave</h1>

    <section class=" d-flex flex-column ga-4 ma-3">

      <div class="d-flex div-pai ga-5 ">

        <v-text-field 
        class=" input-chave"
        v-model="state.pesquisaCredito"
        > </v-text-field>

        <v-btn @click="actions.getCredito(state.pesquisaCredito)" icon="" density="comfortable">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <h3 class="text-subtitle-3" >Dados do Crédito:</h3>

      <div class=" d-flex flex-column ga-6 ">

        <div class=" div-paragrafo d-flex align-itens-center justify-space-around pa-4 border rounded-lg
        " v-for="valor in state.listaDadosCredito">
          <p class="text-subtitle-2 font-weight-black">Chave: {{ valor.CHAVE }}</p>
          <p class="text-subtitle-2 font-weight-black" >CPF: {{ valor.CPF_CNPJ }}</p>
          <p class="text-subtitle-2 font-weight-black">Valor: {{ valor.VALOR}}</p>
          <p class="text-subtitle-2 font-weight-black">Bloqueado: {{ valor.BLOQUEADO}}</p>
        </div>

        <div class=" d-flex justify-end">
          <v-btn :disabled="state.botaoDesbloquearCredito" @click="actions.AbreModalConfirmar()" class="bg-blue"> desbloquear crédito</v-btn>
        </div>
      </div>

    </section>
  </v-container>

  <v-dialog v-model="state.abrirModalConfirmar" >
    <modalConfirmar >
    </modalConfirmar>
  </v-dialog>
</template>

<style scoped>
.input-chave {
  max-width: 20%;
  height: 2rem;
}

.container{
  height: 25rem;
  width: 100rem;
}

.chave{
  margin: 1rem 0rem 0rem 1rem;
}
</style>
