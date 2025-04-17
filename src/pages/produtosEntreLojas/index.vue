<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions, meses, totalGeral } from "./produtosEntreLojas";
import utils, { formatValor } from "@/ts/utils";

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
      <v-row
        class="d-flex justify-end align-center"
        no-gutters
      >
        <v-col
          cols="5"
          class="me-1"
        >
          <v-select
            label="Loja"
            v-model="state.selectedLoja"
            :items="state.lojas"
            item-title="NOME"
            item-value="CGC_CLIENTE"
            :clearable="true"
          >
          </v-select>
        </v-col>

        <v-col
          cols="3"
          class="me-1"
        >
          <v-select
            id="mes"
            label="Mês"
            class="mes"
            v-model="state.mes"
            item-title="title"
            item-value="value"
            :items="meses"
            :clearable="false"
          ></v-select>
        </v-col>

        <v-col cols="2">
          <v-text-field
            id="ano"
            class="ano"
            type="number"
            label="Ano"
            v-model="state.ano"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col
          cols="1"
          class="d-flex justify-end"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            @click="actions.validarFiltros"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-virtual
        id="tabela"
        class="mt-4 pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="350px"
        fixed-header
        :row-props="actions.getClassCorLinha"
      >
        <template v-slot:item.acao="{ item }">
          <v-btn
            icon
            color="primary"
            size="34px"
            @click="actions.abrirModal(item)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
        <template #body.append>
          <tr class="total-row">
            <td colspan="1"><strong>Total Geral:</strong></td>
            <td colspan="1"> </td
            ><td colspan="1">
              <strong>{{ formatValor(totalGeral) }}</strong>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>

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
    >
      Produtos__Entre_Lojas
    </div>

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
    <ModalDetalhes
      :selectedItem="state.dbSelectItem"
      @closeModal="state.modalValeOpened = false"
    />
  </v-dialog>
</template>
