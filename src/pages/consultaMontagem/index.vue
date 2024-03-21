<script setup lang="ts">
import moment from "moment";
import { state, actions, dadosFormatToPrint, itemsToTable } from "./consultaMontagem";
import ModalMontagemInf from "./components/ModalMontagemInf.vue";
import printJS from "print-js";
import { nextTick } from "vue";

nextTick(async () => {
  actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 850px; margin: 0 auto"
    >
      <div class="pb-3 d-flex flex-row justify-end">
        <div class="inputData mr-3">
          <span>Data Inicial</span>
          <input
            v-model="state.dataInicial"
            type="date"
            class="ss"
            style="width: 128px"
            :max="moment().format('YYYY-MM-DD')"
            maxlength="10"
          />
        </div>
        <div class="inputData mr-1">
          <span>Data Final</span>
          <input
            v-model="state.dataFinal"
            type="date"
            class="ss"
            style="width: 128px"
            :max="moment().format('YYYY-MM-DD')"
            maxlength="10"
          />
        </div>

        <v-btn
          color="primary"
          icon="mdi-magnify"
          size="36px"
          class="mt-3 ml-1"
          @click="actions.pesquisarMontagens"
        />
      </div>
      <div style="text-transform: none">
        <v-data-table-virtual
          class="custom-table"
          :headers="state.headers"
          :items="itemsToTable"
          height="550"
          items-per-page-text="Itens por página"
          no-data-text="Não há dados disponíveis"
        >
          <template v-slot:item.DEVOLUCAO="{ value }">
            <spam style="color: #bf3f3f"> -{{ value }} </spam>
          </template>
          <template v-slot:item.inf="{ item }">
            <v-icon
              v-if="item.ID_MONTADOR != null"
              size="large"
              color="primary"
              @click="actions.openModal(item.ID_MONTADOR)"
            >
              mdi-information
            </v-icon>
          </template>
        </v-data-table-virtual>
      </div>

      <div class="d-flex justify-end pt-2">
        <v-btn
          color="primary"
          @click="
            printJS({
              printable: dadosFormatToPrint,
              properties: [
                { field: 'LOGIN', displayName: 'Montador' },
                { field: 'VALOR', displayName: 'Valor' },
                { field: 'DEVOLUCAO', displayName: 'Devolução' },
                { field: 'VALOR_TOTAL', displayName: 'Total' },
              ],
              type: 'json',
              gridHeaderStyle: 'border: 1px solid #000000',
              gridStyle: 'text-align: center; border: 1px solid #000000',
            })
          "
          :disabled="state.dbMontagem.length == 0 ? true : false"
        >
          <v-icon
            size="20px"
            class="mr-2"
          >
            mdi-printer
          </v-icon>
          Imprimir
        </v-btn>
      </div>

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
    </v-card>
    <div id="pnCodigoTela">CONSULTA_MONTAGEM</div>

    <div
      title="Montagem Inf"
      id="modalMontagemInf"
      style="display: none"
    >
      <ModalMontagemInf
        :dataInicio="state.dataInicial"
        :dataFim="state.dataFinal"
        :id_montador="state.idMontador"
        :modalOpened="state.modalMontagemInfOpened"
      ></ModalMontagemInf>
    </div>
  </v-container>
</template>

<style scoped>
.inputData {
  display: flex;
  flex-direction: column;
}

.custom-table {
  background-color: #f0f0f0;
}
</style>
