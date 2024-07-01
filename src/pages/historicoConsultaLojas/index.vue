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
            @click="actions.validarInputs"
          >
          </v-btn>
        </div>
      </div>

      <v-data-table-server
        class="tableHistoricoConsultaLojas"
        items-per-page-text="Itens por página"
        v-model:itemsPerPage="state.itemsPerPage"
        :items-length="state.totalItems"
        style="border-radius: 5px"
        height="560"
        fixed-header
        :headers="state.headers"
        :loading="state.loading"
        :items="state.historicoConsultaLojas"
        :row-props="actions.getClassCorLinha"
        @update:page="actions.updatePage"
      >
        <template #no-data>
          <v-alert
            :value="true"
            icon="mdi-information"
            style="background-color: #ffffff"
          >
            Não há dados disponíveis.
          </v-alert>
        </template>
      </v-data-table-server>
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

.v-data-table-footer {
  max-height: 2px;
  margin-top: 20px;
}

.v-data-table-footer__pagination {
  padding-right: 50px;
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
