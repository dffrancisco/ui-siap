<script setup lang="ts">
import utils from "@/ts/utils";
import { state, actions } from "./desbloqueioCredito";
</script>

<template>
  <div class="container d-flex flex-column ga-3 bg-white rounded-lg">
    <h1 class="mt-4 ml-4 mr-0 mb-0">Chave</h1>
    <section class="d-flex flex-column ga-6 ma-3">
      <div class="d-flex ga-5">
        <v-text-field
          class="input-chave"
          @keyup.enter="actions.getCredito(state.pesquisaCredito)"
          v-model="state.pesquisaCredito"
        >
        </v-text-field>

        <v-btn
          @click="actions.getCredito(state.pesquisaCredito)"
          icon="mdi-magnify"
          density="comfortable"
          class="bg-blue small"
          size="38"
        >
        </v-btn>
      </div>

      <h3 class="text-subtitle-3">Dados do Crédito:</h3>

      <div class="d-flex flex-column ga-6 rounded-lg">
        <div class="div-paragrafo d-flex align-itens-center justify-space-around pa-4 border rounded-lg">
          <v-row>
            <v-col>
              <div>
                <label class="text-subtitle-2">Chave:</label>
                <span class="font-weight-black"> {{ state.credito.CHAVE }} </span>
              </div>

              <div>
                  <label class="text-subtitle-2"> CPF/CNPJ: </label>
                  <span class="font-weight-black">{{ state.credito.CPF_CNPJ }} </span>
              </div>

              <div>
                <label class="text-subtitle-2">Valor:</label>
                <span class="font-weight-black"> {{ utils.formatValor(state.credito.VALOR) }}</span>
              </div>

              <div>
                  <label class="text-subtitle-2" >Bloqueado:</label>
                  <span class="font-weight-black">{{ state.credito.BLOQUEADO === "S" ? "SIM" : "" }}</span>
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="desbloqueia_credito d-flex justify-end">
          <v-btn
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
  width: 100%;
  max-width: 25%;
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

.invisivel {
  visibility: hidden;
  display: inline-block;
  min-width: 10%;
}
</style>
