<script setup lang="ts">
import { actions, state } from "./consultaValePeças";
import { onMounted } from "vue";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5 ma-auto"
      :max-width="900"
      :max-height="600"
    >
      <v-row>
        <v-col cols="6">
          <v-autocomplete
            id="slFuncionario"
            v-model="state.dbSelectItem"
            :items="state.funcionario"
            item-value="value"
            item-title="label"
            clearable
            style="width: 100%"
            label="Funcionário"
          ></v-autocomplete>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Início"
            id="dataInicio"
            type="date"
            v-model="state.dataInicio"
            :clearable="false"
            @keydown.enter="state.inputDataFinal"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Fim"
            id="dataFim"
            type="date"
            v-model="state.dataFim"
            :clearable="false"
            @keydown.enter.prevent="actions.onClickBuscar"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center">
        <v-col cols="4">
          <v-select
            label="Mês"
            id="Mes"
            :items="state.meses"
            v-model="state.mesSelecionado"
            :clearable="false"
          ></v-select>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Ano"
            id="ano"
            type="number"
            v-model="state.ano"
            :clearable="false"
            @keydown.enter.prevent="actions.onClickBuscar"
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Nº Orçamento"
            id="numeroOrcamento"
            type="number"
            v-model="state.numeroOrcamento"
            :clearable="false"
            @keydown.enter.prevent="actions.onClickBuscar"
          ></v-text-field>
        </v-col>

        <v-col
          cols="1"
          class="d-flex justify-center"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            title="Pesquisar"
            @click="actions.validarInputs"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-virtual
        id="tabelaValePeças"
        class="pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="310px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table-virtual>

      <v-row class="mt-4">
        <v-col cols="6">
          <v-text-field
            label="Total mês"
            v-model="state.totalmes"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="5">
          <v-text-field
            label="Total"
            v-model="state.total"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="1">
          <v-btn
            color="primary"
            @click="actions.onClickImprimir"
            :disabled="state.dadosRelatorio.length === 0"
            icon
            size="36px"
            style="min-width: 36px"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div id="pnCodigoTela">consultaValePeças</div>

    <v-overlay
      :model-value="state.loading"
      class="d-flex align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style>
#tabelaValePeças .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}
#tabelaValePeças .v-data-table-footer__pagination {
  padding-right: 50px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
