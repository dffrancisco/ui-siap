<script setup lang="ts">
import { actions, state, totalGeral, getMonthName } from "./consultaValePecas";
import ModalVale from "./components/ModalConsultaValePecas.vue";
import { onMounted, computed } from "vue";
import utils, { formatValor } from "@/ts/utils";

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
        <v-col cols="6">
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
        <v-col cols="3">
          <v-text-field
            label="Ano"
            id="ano"
            type="number"
            v-mask="'####'"
            v-model="state.ano"
            :clearable="false"
            @keydown.enter.prevent="actions.validarInputs"
          ></v-text-field>
        </v-col>
        <v-col
          cols="1"
          class="d-flex justify-center"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            title="Pesquisar"
            @click="actions.validarInputs"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-virtual
        id="tabelaValePeças"
        class="pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="360px"
        :group-by="[{ key: 'V_NOME_FUNCIONARIO' }, { key: 'MES' }]"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      >
        <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr class="group-header">
            <td :colspan="columns.length">
              <v-btn
                variant="text"
                size="small"
                :icon="isGroupOpen ? 'mdi-plus' : 'mdi-plus'"
                @click="toggleGroup(item)"
              ></v-btn>

              <template v-if="typeof item.value === 'string'">
                <strong class="mr-9">{{ item.value }}</strong>
              </template>
              <template v-else>
                <strong class="mr-9">{{ getMonthName(Number(item.value)) }}</strong>
                <span
                  class="mr-3"
                  style="font-size: 13px"
                  >Qtd Orçamentos: {{ item.items.length }}</span
                >
                <span style="font-size: 13px">
                  Total Mês: {{ utils.formatValor(item.items[0]?.raw?.TOTAL_MES || 0) }}
                </span>
              </template>
            </td>
          </tr>
        </template>

        <template v-slot:item.acao="{ item }">
          <v-btn
            icon
            color="primary"
            size="34px"
            @click="actions.abrirModal(item)"
            style="min-width: 36px"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table-virtual>

      <v-row class="mt-4 justify-end align-center">
        <v-col
          cols="auto"
          class="text-end"
        >
          <strong style="font-size: 15px">Total Geral:</strong>
        </v-col>
        <v-col
          cols="auto"
          class="text-right"
        >
          <strong style="font-size: 15px">{{ utils.formatValor(totalGeral) }}</strong>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="actions.onClickImprimir"
            :disabled="state.dadosRelatorio.length === 0"
            icon
            size="36px"
            style="min-width: 36px"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-col>
      </v-row>
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

  <v-dialog
    v-model="state.modalValeOpened"
    max-width="900px"
  >
    <ModalVale
      :selectedItem="state.dbSelectItem"
      @closeModalVale="state.modalValeOpened = false"
    />
  </v-dialog>
</template>

<style>
#tabelaValePeças .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}
.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
