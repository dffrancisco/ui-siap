<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./usoConsumo";

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
      <v-row
        class="d-flex justify-end align-center"
        no-gutters
      >
        <v-col
          cols="2"
          class="me-3"
        >
          <v-text-field
            label="Data de Início"
            id="dataInicio"
            class="dataInicio"
            type="date"
            v-model="state.dataInicio"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="Data de Fim"
            id="dataFim"
            class="dataFim"
            type="date"
            v-model="state.dataFim"
            :clearable="false"
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
        id="tabela"
        class="mt-4 pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="350px"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      ></v-data-table>

      <div class="d-flex justify-end pt-5">
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

    <div id="pnCodigoTela"> Uso_Consumo </div>

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

.me-3 {
  margin-right: 16px;
}

.btnPesquisar {
  display: flex;
  align-items: left;
  margin-left: 16px;
}
</style>
