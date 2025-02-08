<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./relatorioAvarias";
onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container
    ><v-card
      class="pa-5 ma-auto"
      :max-width="930"
      :max-height="600"
    >
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            id="marcas"
            label="Marcas"
            class="marcas"
            autocomplete="off"
            :items="state.marcas"
            item-title="DESCRICAO"
            item-value="ID_MARCA"
            :clearable="false"
            v-model="state.marcaSelecionada"
            multiple
          ></v-autocomplete>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Início"
            id="dataInicio"
            class="dataInicio"
            type="date"
            v-model="state.dataInicio"
            :clearable="false"
            @keydown.enter="state.inputDataFinal.focus()"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Fim"
            id="dataFim"
            class="dataFim"
            type="date"
            v-model="state.dataFim"
            :clearable="false"
            @keydown.enter.prevent="actions.validarInputs"
          ></v-text-field>
        </v-col>

        <v-col
          cols="2"
          class="btnPesquisar"
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
          <v-btn
            class="ml-3"
            color="primary"
            :disabled="state.dadosRelatorioAvarias.length === 0"
            icon="mdi-printer"
            size="36px"
            title="Imprimir"
            @click="actions.imprimirRelatorioAvarias"
          >
            <v-icon left>mdi-printer</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-virtual
        class="pt-4"
        :items="state.dadosRelatorioAvarias"
        :headers="state.headers"
        height="450px"
        style="border-radius: 5px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table-virtual>
    </v-card>
    <div id="pnCodigoTela"> relatorioAvarias </div>

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
.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
