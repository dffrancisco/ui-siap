<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./consultaValeDinheiro";

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
        <v-col cols="4">
          <v-autocomplete
            :clearable="true"
            label="Funcionário"
            multiple
            v-model="state.selectedFuncionario"
            :items="state.funcionarios"
            item-title="NOME_COMP"
            item-value="COD_FUNCIONARIO"
          ></v-autocomplete>
        </v-col>

        <v-col
          cols="3"
          class="me-3"
        >
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
            @keydown.enter.prevent="actions.onClickBuscar"
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
            @click="actions.onClickBuscar"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-virtual
        id="tabelaUsoConsumo"
        class="mt-4 pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="360px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table-virtual>

      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="actions.onClickImprimir"
          :disabled="state.dadosRelatorio.length === 0"
          icon="mdi-printer"
          size="36px"
        >
          <v-icon left>mdi-printer</v-icon>
        </v-btn>
      </div>
    </v-card>

    <div id="pnCodigoTela"> consultaValeDinheiro </div>

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
#tabelaUsoConsumo .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

#tabelaUsoConsumo .v-data-table-footer__pagination {
  padding-right: 50px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.btnPesquisar {
  display: flex;
  align-items: left;
  margin-left: 16px;
}
</style>
