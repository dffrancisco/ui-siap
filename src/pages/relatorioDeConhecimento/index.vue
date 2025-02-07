<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./relatorioDeConhecimento";

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
      <v-row dense>
        <v-col cols="3">
          <v-select
            label="Transportadora"
            id="transportadoraSelect"
            v-model="state.transportadoras"
            :items="state.transportadora"
            item-value="value"
            item-title="label"
            :clearable="false"
            @keydown.enter.prevent="actions.buscarDadosComValidacao"
            style="width: 100%"
          ></v-select>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Início"
            id="dataInicio"
            class="dataInicio"
            v-model="state.dataInicio"
            type="date"
            :clearable="false"
            style="width: 92%"
            @keydown.enter.prevent="actions.buscarDadosComValidacao"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Fim"
            id="dataFim"
            class="dataFim"
            v-model="state.dataFim"
            type="date"
            :clearable="false"
            style="width: 92%; margin-left: -15px"
            @keydown.enter.prevent="actions.buscarDadosComValidacao"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-select
            label="Ordenar"
            id="conteudo"
            v-model="state.selectedConteudo"
            :items="state.ordem"
            item-value="value"
            item-title="label"
            :clearable="false"
            @keydown.enter.prevent="actions.buscarDadosComValidacao"
            style="width: 110%; margin-left: -30px"
          ></v-select>
        </v-col>

        <v-col cols="1">
          <div
            class="btnPesquisar"
            style="justify-content: flex-start; margin-left: -15px"
          >
            <v-btn
              color="primary"
              icon="mdi-magnify"
              size="35px"
              @click="actions.buscarDadosComValidacao"
              style="margin-right: 5px"
            >
            </v-btn>
            <v-btn
              color="primary"
              @click="actions.onClickImprimir"
              :disabled="state.dadosRelatorio.length === 0"
              icon="mdi-printer"
              size="35px"
              title="Imprimir"
            >
              <v-icon left>mdi-printer</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-data-table-virtual
          id="tabela"
          class="tableRelatorio pt-2"
          v-model:items-per-page="state.itemsPerPage"
          :items="state.dadosRelatorio"
          :headers="state.headers"
          :items-length="state.totalItems"
          height="400px"
          style="border-radius: 5px"
          fixed-header
          :row-props="actions.getClassCorLinha"
        >
        </v-data-table-virtual>
      </div>

      <div class="pt-5 btnPrint"> </div>
    </v-card>

    <div id="pnCodigoTela">RELATORIO_CONHECIMENTO</div>

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
  </v-container>
</template>

<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>

<style scoped>
.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}

.btnPesquisar {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
