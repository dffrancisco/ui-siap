<script setup lang="ts">
import { mesesToSelect } from "@/constants/constants";
import { actions, state } from "./vendaPorMarca";
import { nextTick } from "vue";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card>
      <v-row class="px-12 py-8 consulta_container">
        <div class="inputs">
          <v-autocomplete
            v-model="state.mes"
            label="Mês"
            autocomplete="off"
            :items="mesesToSelect"
            name="MES"
            id="MES"
            @keydown.enter="state.edtAno.focus()"
          ></v-autocomplete>

          <v-text-field
            v-model="state.ano"
            label="Ano"
            variant="outlined"
            maxlength="4"
            v-mask="'####'"
            id="ANO"
            name="ANO"
            autocomplete="off"
            @keydown.enter="actions.getVendasPorMarca"
          ></v-text-field>
          <v-btn
            color="primary"
            icon="mdi-magnify mdi-24px"
            size="42"
            @click="actions.getVendasPorMarca"
          />
        </div>
        <div class="btn_print_container">
          <v-btn
            color="primary"
            @click="actions.onClickImprimir"
            :disabled="state.dbVendasPorMarca.length == 0 ? true : false"
          >
            <v-icon class="mr-2">mdi-printer </v-icon>Imprimir
          </v-btn>
        </div>
      </v-row>
      <v-data-table
        :headers="state.headers"
        :items="state.dbVendasPorMarca"
        height="576"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
      >
      </v-data-table>
    </v-card>
    <div id="pnCodigoTela">VENDA_POR_MARCA</div>
  </v-container>

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
</template>

<style scoped>
.consulta_container {
  display: flex;
  justify-content: space-between;
}

.inputs {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.btn_print_container {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
