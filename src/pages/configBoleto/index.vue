<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions, computeds, selectedCarteira } from "./configBoleto";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      maxWidth="900"
      maxHeight="550"
      class="ma-auto pa-4"
    >
      <div class="d-flex align-center justify-center pb-4"
        ><v-card-title>Opção do Boleto Bancário</v-card-title></div
      >

      <div class="d-flex flex-column ga-2 pt-2">
        <div class="d-flex ga-4">
          <v-row>
            <v-col cols="3">
              <v-text-field
                label="Banco"
                class="obr rounded-lg"
                id="banco"
                maxlength="3"
                v-model="state.dadosBoleto.BANCO"
                :clearable="false"
                :disabled="state.botaoAlterarHabilitado"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Agência"
                class="obr rounded-lg"
                maxlength="6"
                v-model="state.dadosBoleto.AGENCIA"
                :clearable="false"
                :disabled="state.botaoAlterarHabilitado"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="Conta Bancária"
                class="obr rounded-lg"
                maxlength="15"
                v-model="state.dadosBoleto.CONTA_BANCARIA"
                :clearable="false"
                :disabled="state.botaoAlterarHabilitado"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex ga-4 pt-1">
          <v-row>
            <v-col cols="3">
              <v-select
                label="Carteira"
                :items="state.carteiraBancoBradesco"
                class="obr rounded-lg"
                item-title="NUM_CARTEIRA"
                item-value="NUM_CARTEIRA"
                v-model="selectedCarteira"
                :clearable="false"
                :disabled="state.botaoAlterarHabilitado"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Código Escritural"
                :model-value="computeds.codigoEscritural"
                :clearable="false"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Digito Cód. Escritural"
                :model-value="computeds.digitoCodigoEscritural"
                :clearable="false"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Juros Boleto"
                class="obr rounded-lg"
                v-mask-decimal.br="2"
                v-model="state.dadosBoleto.JUROS"
                :clearable="false"
                :disabled="state.botaoAlterarHabilitado"
                @keypress.enter.prevent="actions.salvar"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex ga-4 pt-2">
          <v-row>
            <v-col cols="12">
              <v-textarea
                label="Instruções do Boleto"
                class="obr rounded-lg"
                maxlength="200"
                v-model="state.dadosBoleto.OBS_BOLETO"
                :clearable="false"
                :disabled="state.botaoAlterarHabilitado"
                @keypress.enter.prevent="actions.salvar"
              ></v-textarea>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex align-center justify-center pt-1">
          <div class="divBtns">
            <v-btn
              color="primary"
              @click="actions.alterar"
              prepend-icon="mdi-pen"
              :disabled="!state.botaoAlterarHabilitado"
              >Alterar</v-btn
            >
            <v-btn
              color="primary"
              @click="actions.salvar"
              prepend-icon="mdi-content-save"
              :disabled="!state.botaoSalvarHabilitado"
              >Salvar</v-btn
            >
            <v-btn
              color="primary"
              @click="actions.cancelar"
              prepend-icon="mdi-cancel"
              :disabled="!state.botaoCancelarHabilitado"
              >Cancelar</v-btn
            >
          </div>
        </div>
      </div>
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
    <div id="pnCodigoTela">configBoleto</div>
  </v-container>
</template>

<style scoped>
.divBtns {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
