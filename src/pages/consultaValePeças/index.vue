<script setup lang="ts">
import { actions, state } from "./consultaValePeças";
import { onUnmounted } from "vue";

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
      <v-col cols="4">
        <span>Funcionario</span>
        <v-autocomplete
          id="slFuncionario"
          v-model="state.dbSelectItem"
          :items="state.funcionario"
          item-value="value"
          item-title="label"
          clearable
          style="width: 100%"
        ></v-autocomplete>
      </v-col>
      <v-row
        class="d-flex justify-end align-center"
        no-gutters
      >
        <span>Data Orçamento</span>
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
          cols="3"
          class="me-3"
        >
          <span>Mês/Ano Vencimento</span>
          <v-select
            label="Mês"
            id="Mes"
            class="Mes"
            :items="state.meses"
            v-model="state.mesSelecionado"
            :clearable="false"
            @change="state.inputDataFinal.focus()"
          ></v-select>

          <v-col cols="3">
            <v-text-field
              label="Ano"
              id="ano"
              class="ano"
              type="number"
              v-model="state.ano"
              :clearable="false"
              @keydown.enter.prevent="actions.onClickBuscar"
            ></v-text-field>
          </v-col>
        </v-col>

        <v-col
          cols="3"
          class="me-3"
        >
          <span>Nº Orçamento</span>
          <v-text-field
            label="Nº Orçamento"
            id="numeroOrcamento"
            class="numeroOrcamento"
            type="number"
            v-model="state.numeroOrcamento"
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

      <v-data-table
        id="tabelaValePeças"
        class="mt-4 pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="350px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table>

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

.btnPesquisar {
  display: flex;
  align-items: left;
  margin-left: 16px;
}
</style>
