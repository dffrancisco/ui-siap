<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions, meses } from "./historicoConsultaLojas";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 876px; margin: 0 auto"
    >
      <div class="divInputs">
        <div style="display: flex; gap: 16px">
          <v-select
            id="mes"
            label="Mês"
            class="obr mes"
            v-model="state.mes"
            item-title="title"
            item-value="value"
            :items="meses"
            :clearable="false"
          ></v-select>

          <v-text-field
            id="ano"
            class="obr ano"
            type="number"
            label="Ano"
            v-model="state.ano"
            :clearable="false"
          ></v-text-field>
        </div>
        <div class="btnPesquisar">
          <v-btn
            color="primary"
            class="mt-3"
            icon="mdi-magnify"
            size="36px"
            @click="actions.getHistoricoConsultaLojas"
          >
          </v-btn>
        </div>
      </div>

      <v-data-table
        class="tableHistoricoConsultaLojas"
        no-data-text="Não há dados disponíveis"
        v-model:itemsPerPage="state.totalItems"
        style="border-radius: 5px"
        height="560"
        fixed-header
        :headers="state.headers"
        :loading="state.loading"
        :items="state.historicoConsultaLojas"
        :row-props="actions.getClassCorLinha"
      >
        <template #bottom></template>
      </v-data-table>
      <div class="pt-2 btnPrint">
        <v-btn
          color="primary"
          @click="actions.imprimirVendasPerdidas"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
      </div>
    </v-card>

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

    <div id="pnCodigoTela">HISTORICO_CONSULTA_LOJAS</div>
  </v-container>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.cor-zebrada-2 {
  background-color: #fff;
}
</style>

<style scoped>
.btnPrint {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.tableHistoricoConsultaLojas {
  margin-top: 20px;
}

.divInputs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.btnPesquisar {
  margin-top: -12px;
  margin-left: 10px;
}

.mes,
.ano {
  width: 200px;
  border-radius: 6px;
}
</style>
