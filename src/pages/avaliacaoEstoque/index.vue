<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./avaliacaoEstoque";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5 ma-auto"
      style="max-width: 900px"
    >
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="state.mesSelecionado"
            :items="state.meses"
            item-value="value"
            item-title="label"
            label="Mês"
            clearable
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="state.anoSelecionado"
            type="number"
            label="Ano"
          ></v-text-field>
        </v-col>

        <v-col
          cols="1"
          class="d-flex align-center"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            @click="actions.init()"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-server
        class="mt-4 pt-5"
        v-model:items-per-page="state.itemsPerPage"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        :loading="state.loading"
        :items-length="state.totalItems"
        height="350px"
        fixed-header
        :row-props="actions.getClassCorLinha"
      >
        <template #no-data>
          <v-alert
            :value="true"
            icon="mdi-information"
            class="text-center"
          >
            Não há dados disponíveis.
          </v-alert>
        </template>
      </v-data-table-server>

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

    <div
      id="pnCodigoTela"
      class="mt-3"
      >Avaliação_Estoque</div
    >

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
.v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

.v-data-table-footer__pagination {
  padding-right: 50px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}
</style>
