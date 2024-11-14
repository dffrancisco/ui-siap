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
      :max-width="900"
      :max-height="600"
    >
      <v-row>
        <v-col cols="4">
          <span>Avaliação:</span>
          <v-select
            v-model="state.mesSelecionado"
            :items="[
              { value: '1', label: 'JANEIRO' },
              { value: '2', label: 'FEVEREIRO' },
              { value: '3', label: 'MARÇO' },
              { value: '4', label: 'ABRIL' },
              { value: '5', label: 'MAIO' },
              { value: '6', label: 'JUNHO' },
              { value: '7', label: 'JULHO' },
              { value: '8', label: 'AGOSTO' },
              { value: '9', label: 'SETEMBRO' },
              { value: '10', label: 'OUTUBRO' },
              { value: '11', label: 'NOVEMBRO' },
              { value: '12', label: 'DEZEMBRO' },
            ]"
            item-value="value"
            item-title="label"
            clearable
            style="width: 100%"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <span>Ano:</span>
          <v-text-field
            v-model="state.ano"
            type="number"
            style="width: 100%"
          ></v-text-field>
        </v-col>

        <v-col cols="1">
          <div class="btnPesquisar">
            <v-btn
              color="primary"
              icon="mdi-magnify"
              size="36px"
              style="margin-top: 13px"
            >
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-data-table
          class="avaliacaoEstoque pt-5"
          v-model:items-per-page="state.itemsPerPage"
          :items="state.dadosRelatorio"
          :loading="state.loading"
          :items-length="state.totalItems"
          height="350px"
          fixed-header
          :row-props="actions.getClassCorLinha"
          @update:page="actions.updatePage"
        >
        </v-data-table>
      </div>

      <div class="pt-5">
        <v-row>
          <v-col class="d-flex justify-end">
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
          </v-col>
        </v-row>
      </div>
    </v-card>

    <div id="pnCodigoTela">Avaliação_Estoque</div>

    <v-overlay :value="state.loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
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
