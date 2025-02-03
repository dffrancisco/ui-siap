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
      <v-row>
        <v-col cols="3">
          <v-select
            label="Transportadora"
            id="transportadoraSelect"
            v-model="state.transportadoras"
            :items="state.transportadora"
            item-value="value"
            item-title="label"
            clearable
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
            dense
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
            dense
            @keydown.enter.prevent="actions.buscarDadosComValidacao"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-select
            label="Ordenar"
            id="slOrdenacao"
            v-model="state.ordenacao"
            :items="state.ordenacaoOptions"
            item-value="value"
            item-title="label"
            style="width: 100%"
          ></v-select>
        </v-col>

        <v-col>
          <div class="btnPesquisar">
            <v-btn
              color="primary"
              icon="mdi-magnify"
              size="36px"
              @click="actions.buscarDadosComValidacao"
            >
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-data-table
          id="tabela"
          class="tableRelatorio pt-5"
          v-model:items-per-page="state.itemsPerPage"
          :items="state.dadosRelatorio"
          :headers="state.headers"
          :items-length="state.totalItems"
          height="350px"
          style="border-radius: 5px"
          fixed-header
          :row-props="actions.getClassCorLinha"
          @update:page="actions.updatePage"
        >
        </v-data-table>
      </div>

      <div class="pt-5 btnPrint">
        <v-btn
          color="primary"
          @click="actions.onClickImprimir"
          :disabled="state.dadosRelatorio.length === 0"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        >
          <v-icon left>mdi-printer</v-icon>
        </v-btn>
      </div>
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
#tabela .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

#tabela .v-data-table-footer__pagination {
  padding-right: 50px;
}

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
