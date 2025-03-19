<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./configBoleto";

onMounted(async () => {
  actions.init();
});
</script>

<template
  ><v-container>
    <v-card
      maxWidth="900"
      maxHeight="550"
      class="ma-auto pa-4"
    >
      <div class="d-flex flex-column ga-2">
        <div class="d-flex ga-4">
          <v-row>
            <v-col cols="3">
              <v-text-field label="Banco"> </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Agência"> </v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field label="Conta Bancária"> </v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex ga-4 pt-1">
          <v-row>
            <v-col cols="3">
              <v-text-field label="Carteira"> </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="Código Escritural"> </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="Digito Cód. Escritural"> </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="Juros Boleto"> </v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex ga-4 pt-2">
          <v-row>
            <v-col cols="12">
              <v-textarea label="Instruções do Boleto"> </v-textarea>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex align-center justify-center pt-1">
          <div class="divBtns">
            <v-btn color="primary">Alterar</v-btn>
            <v-btn color="primary">Salvar</v-btn>
            <v-btn color="primary">Cancelar</v-btn>
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
