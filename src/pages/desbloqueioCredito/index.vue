<script setup lang="ts">
import utils from "@/ts/utils";
import { state, actions } from "./desbloqueioCredito";
import Loading from "@/components/Loading.vue";
</script>

<template>
  <v-container>
    <v-card class="container-desbloquear-credito">
      <div class="d-flex ga-2">
        <v-text-field
          label="Chave"
          class="input-chave"
          autofocus
          v-model="state.chave"
          ref="inputChaveRef"
          @keyup.enter="actions.getCredito(state.chave)"
        />

        <v-btn
          icon="mdi-magnify"
          color="primary"
          size="small"
          @click="actions.getCredito(state.chave)"
        />
      </div>

      <div class="d-flex flex-column ga-4 rounded-lg flex-grow-1">
        <h3 class="text-subtitle-3">Dados do Crédito:</h3>
        <div class="flex-grow-1">
          <div class="d-flex align-itens-center justify-space-around pa-6 border rounded-lg">
            <v-row
              justify="space-between"
              class="pa-0"
            >
              <v-col
                cols="3"
                class="pa-0"
              >
                <label class="mr-2 text-subtitle-2">Chave:</label>
                <span class="font-weight-black"> {{ state.credito.CHAVE }} </span>
              </v-col>

              <v-col
                cols="4"
                class="pa-0"
              >
                <label class="mr-2 text-subtitle-2"> CPF/CNPJ: </label>
                <span class="font-weight-black">{{ state.credito.CPF_CNPJ }} </span>
              </v-col>

              <v-col
                cols="3"
                class="pa-0"
              >
                <label class="mr-2 text-subtitle-2">Valor:</label>
                <span class="font-weight-black">
                  {{ state.credito.VALOR ? utils.formatValor(state.credito.VALOR) : "" }}</span
                >
              </v-col>

              <v-col
                cols="2"
                class="pa-0"
              >
                <label class="mr-2 text-subtitle-2">Bloqueado:</label>
                <span class="font-weight-black">{{ state.credito.BLOQUEADO === "S" ? "SIM" : "" }}</span>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="desbloqueia_credito d-flex justify-end">
          <v-btn
            class="bg-blue"
            :disabled="!state.credito.ID_CREDITO"
            @click="actions.onClickConfirmarDesbloqueio"
          >
            desbloquear crédito</v-btn
          >
        </div>
      </div>
    </v-card>

    <Loading :loading="state.loading" />
  </v-container>
</template>

<style scoped>
.container-desbloquear-credito {
  width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 32px;
  height: 60vh;
}

.input-chave {
  width: 100%;
  max-width: 25%;
  height: 2rem;
}

.invisivel {
  visibility: hidden;
  display: inline-block;
  min-width: 10%;
}
</style>
