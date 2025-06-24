<script setup lang="ts">
import { onMounted, reactive } from "vue";
import utils from "@/ts/utils";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import modalConfirmar from "./components/modalConfirmar.vue";

// teste
import { ref } from 'vue'
const mostrarDados = ref(true)
// fim teste

</script>

<template>
  <v-container class=" d-flex flex-column ga-3 bg-white rounded-lg ">
    <h2 class="">LIBERAR CRÉDITO MANUAL</h2>

    <h3>Chave</h3>

    <section class=" d-flex flex-column ga-4">

      <div class="d-flex div-pai ga-5 ">
        <v-text-field class="input-chave">

        </v-text-field>

        <v-btn @click="mostrarDados = !mostrarDados" icon="" density="comfortable">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <h3>Dados do Crédito:</h3>

      <div class=" d-flex flex-column ga-4 " v-if="mostrarDados">

        <div class=" div-paragrafo d-flex align-itens-center justify-space-around pa-4 border rounded-lg  ">
          <p class="text-subtitle-2">Chave: {{ }}</p>
          <p class="text-subtitle-2">Cpf: {{ }}</p>
          <p class="text-subtitle-2">Valor: {{ }}</p>
          <p class="text-subtitle-2">Bloqueado: {{ }}</p>
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
