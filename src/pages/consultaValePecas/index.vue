<script setup lang="ts">
import { actions, state } from "./consultaValePecas";
import ModalVale from "./components/ModalConsultaValePecas.vue";
import { onMounted, computed } from "vue";

onMounted(() => {
  actions.init();
});

const totalGeral = computed(() => {
  return state.dadosRelatorio.reduce((acc, item) => acc + Number(item.VALOR || 0), 0).toFixed(2);
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
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
      >
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

      <v-row class="mt-4">
        <v-col cols="11">
          <span class="text">Total Anual R$:</span>
          <v-text-field
            label=""
            :value="totalGeral"
            :clearable="false"
            readonly
            width="30%"
          ></v-text-field>
        </v-col>

        <v-col cols="1">
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
    /><ModalConsultaValePecas />
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
