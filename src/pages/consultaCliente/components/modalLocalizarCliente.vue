<script lang="ts" setup>
import moment from "moment";
import { reactive } from "vue";

const state = reactive({
  loading: false,
  dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
  dataFim: moment().format("YYYY-MM-DD"),
  inputDataFinal: <HTMLInputElement>{},
});
</script>
<template
  ><v-card class="pa-4"
    ><div style="display: flex; gap: 16px">
      <v-text-field
        label="Pesquisar cliente"
        :clearable="false"
        autofocus
        id="inputSearchCliente"
      ></v-text-field>

      <v-text-field
        v-model="state.dataInicio"
        width="50px"
        label="Data Início"
        type="date"
        :clearable="false"
        @keydown.enter="state.inputDataFinal.focus()"
      >
      </v-text-field>

      <v-text-field
        v-model="state.dataFim"
        label="Data Fim"
        id="DATA_FIM"
        width="50px"
        type="date"
        :clearable="false"
      >
      </v-text-field>

      <div>
        <v-btn
          title="Consultar"
          height="40px"
          color="#3680AB"
        >
          Consultar Cliente
          <v-icon class="ml-2">mdi-magnify</v-icon>
        </v-btn>
      </div>
    </div></v-card
  ></template
>
<style scoped></style>
