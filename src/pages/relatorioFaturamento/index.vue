<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./relatorioFaturamento";
import ModalSelecionarCliente from "./components/ModalSelecionarCliente.vue";
import { useEventListener } from "@vueuse/core";

useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.modalSelecionarClienteFaturadoOpened = true;
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      :width="800"
      :height="550"
      class="ma-auto pa-4"
    >
      <div
        ><v-row>
          <v-col cols="3">
            <v-text-field
              v-model="state.dataInicio"
              label="Data Início"
              type="date"
            >
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="state.dataFim"
              label="Data Fim"
              type="date"
            >
            </v-text-field>
          </v-col>
          <v-col class="d-flex flex-row align-center ga-2">
            <v-text-field
              label="Cliente (F1)"
              v-model="state.clienteSelecionado.NOME"
              :disabled="!state.clienteSelecionado.ID_CLIENTE"
              readonly
              :clearable="false"
            ></v-text-field>
            <v-btn
              icon="mdi-magnify mdi-24px"
              color="primary"
              size="36"
              @click="actions.openModalSelecionarCliente"
            ></v-btn>
          </v-col>
        </v-row>
      </div>

      <div
        id="gridOrcamentosFaturados"
        class="mt-4"
      ></div>

      <div class="mt-2 d-flex justify-end">
        <v-btn
          :disabled="!state.clienteSelecionado.ID_CLIENTE"
          color="primary"
          size="36"
          title="Imprimir"
          icon="mdi-printer mdi-24px"
          @click="actions.onClickImprimir"
        ></v-btn>
      </div>
    </v-card>

    <div id="pnCodigoTela">relatorioFaturamento</div>

    <v-dialog
      v-model="state.modalSelecionarClienteFaturadoOpened"
      :width="600"
    >
      <ModalSelecionarCliente
        :dataInicio="state.dataInicio"
        :dataFim="state.dataFim"
        @closeModal="state.modalSelecionarClienteFaturadoOpened = false"
        @selecionarCliente="actions.getOrcamentosFaturados"
      />
    </v-dialog>

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
