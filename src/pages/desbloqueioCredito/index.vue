<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import modalConfirmar from "./components/modalConfirmar.vue";
import utils, { confirmaCodigo } from "../../ts/utils";
import { state, actions } from "./desbloqueioCredito";
</script>

<template>
  <div class="container d-flex flex-column ga-3 bg-white rounded-lg">
    <h1 class="chave">Chave</h1>
    <section class="teste d-flex flex-column ga-6 ma-3">
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
          class="bg-blue small"
          size="38"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <h3 class="text-subtitle-3">Dados do Crédito:</h3>

      <div class="d-flex flex-column ga-6 rounded-lg">
        <div
          v-if="state.dadosCredito"
          class="div-paragrafo d-flex align-itens-center justify-space-around pa-4 border rounded-lg"
        >
          <p class="text-subtitle-2">
            Chave: <span class="font-weight-black"> {{ state.credito.CHAVE }} </span>
          </p>
          <p class="text-subtitle-2"
            >CPF/CNPJ: <span class="font-weight-black">{{ state.credito.CPF_CNPJ }} </span>
          </p>
          <p class="text-subtitle-2"
            >Valor: <span class="font-weight-black"> {{ utils.formatValor(state.credito.VALOR) }} </span>
          </p>
          <p class="text-subtitle-2"
            >Bloqueado:
            <span class="font-weight-black"> {{ state.credito.BLOQUEADO === "S" ? "SIM" : "NÃO" }}</span>
          </p>
        </div>

        <div class="desbloqueia_credito d-flex justify-end">
          <v-btn
            :disabled="state.botaoDesbloquearCredito"
            @click="actions.onClickConfirmaDesbloqueio"
            class="bg-blue"
          >
            desbloquear crédito</v-btn
          >
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.input-chave {
  max-width: 20%;
  height: 2rem;
}

.container {
  height: 60%;
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

/* .desbloqueia_credito {
  position: absolute;
  bottom: 1.6rem;
  right: 1.4rem; 
} */

/* .desbloqueia_credito{
  position: fixed;
  right: 10rem;
  bottom: 19rem;
} */
</style>
