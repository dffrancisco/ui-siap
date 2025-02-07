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
      :max-width="900"
      :max-height="600"
    >
      <v-row>
        <v-col cols="5">
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
            @keydown.enter.prevent="actions.getDadosRelatorioAvarias"
          ></v-text-field>
        </v-col>

        <v-col
          cols="1"
          class="btnPesquisar"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            @click="actions.getDadosRelatorioAvarias"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- <v-data-table-virtual
        class="mt-4 pt-5"
        :items="state.dadosRelatorioAvarias"
        :headers="state.headers"
        height="350px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table-virtual>  -->
    </v-card></v-container
  >
</template>

<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
