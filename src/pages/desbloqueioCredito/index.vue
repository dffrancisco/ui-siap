<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import modalConfirmar from "./components/modalConfirmar.vue";
import utils, { swalDarkError, swalDarkSuccess } from "../../ts/utils";
import { state, actions } from "./desbloqueioCredito";
</script>

<template>
  <div class="container d-flex flex-column ga-3 bg-white rounded-lg">
    <h1 class="chave">Chave</h1>

    <section class="container_2 d-flex flex-column ga-4 ma-3">
      <div class="d-flex div-pai ga-5">
        <v-text-field
          class="input-chave"
          v-model="state.pesquisaCredito"
        >
        </v-text-field>

        <v-btn
          @click="actions.getCredito(state.pesquisaCredito)"
          icon=""
          density="comfortable"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <h3 class="text-subtitle-3">Dados do Crédito:</h3>

      <div class="d-flex flex-column ga-6">
        <div
          class="div-paragrafo d-flex align-itens-center justify-space-around pa-4 border rounded-lg"
          v-for="valor in state.listaDadosCredito" 
        >
          <p class="text-subtitle-2">
            Chave: <span class="font-weight-black"> {{ valor.CHAVE }} </span>
          </p>
          <p class="text-subtitle-2"
            >CPF: <span class="font-weight-black">{{ valor.CPF_CNPJ }} </span>
          </p>
          <p class="text-subtitle-2"
            >Valor: <span class="font-weight-black"> {{ valor.VALOR  }} </span>
          </p>
          <p class="text-subtitle-2"
            >Bloqueado: <span class="font-weight-black"> {{ valor.BLOQUEADO.trim() === 'S' ? "SIM" : "NÃO" }}</span>
          </p>
        </div>

        <div class="d-flex justify-end">
          <v-btn
            :disabled="state.botaoDesbloquearCredito"
            @click="actions.AbreModalConfirmar()"
            class="bg-blue"
          >
            desbloquear crédito</v-btn
          >
        </div>
      </div>
    </section>
  </div>

  <v-dialog v-model="state.abrirModalConfirmar">
    <modalConfirmar> </modalConfirmar>
  </v-dialog>
</template>

<style scoped>
.input-chave {
  max-width: 20%;
  height: 2rem;
}

.container {
  /* height: 23rem; */
  height: 55%;
  width: 80%;
  max-width: 100%;
  position: relative;
  left: 10.1%;
  top: 6%;
  padding: 1.6rem 2rem;
}

.chave {
  margin: 1rem 0rem 0rem 1rem;
}
</style>
