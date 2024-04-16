<script setup lang="ts">
import moment from "moment";
import { state, actions, vendasOrdenadas } from "./vendaPorVendedor";
import { nextTick } from "vue";
import ModalVendasDetalhes from "./components/ModalVendasDetalhes.vue";
import ModalVendasGraficos from "./components/ModalVendasGraficos.vue";

nextTick(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 876px; margin: 0 auto"
    >
      <div class="inputs pb-3">
        <div class="inputData">
          <span>Data Inicial</span>
          <input
            v-model="state.dataInicial"
            id="DATA_INICIAL"
            name="DATA_INICIAL"
            type="date"
            class="ss obr"
            maxlength="10"
            :max="moment().format('YYYY-MM-DD')"
            @keydown.enter="state.inputDataFinal.focus()"
          />
        </div>
        <div class="inputData">
          <span>Data Final</span>
          <input
            v-model="state.dataFinal"
            id="DATA_FINAL"
            name="DATA_FINAL"
            type="date"
            class="ss obr"
            :max="moment().format('YYYY-MM-DD')"
            @keydown.enter.prevent="actions.pesquisarVendas"
            maxlength="10"
          />
        </div>
        <div>
          <v-btn
            color="primary"
            class="mt-3"
            icon="mdi-magnify"
            size="36px"
            @click="actions.pesquisarVendas"
          >
          </v-btn>
        </div>
      </div>

      <v-data-table
        :headers="state.headers"
        :items="vendasOrdenadas"
        style="text-transform: none"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        class="ss custom-table"
        height="482"
        items-per-page="50"
      >
        <template v-slot:item.VALOR_DEVOLUCAO="{ value }">
          <spam style="color: #bf3f3f"> -{{ value }} </spam>
        </template>
        <template v-slot:item.inf="{ item }">
          <v-icon
            v-if="item.COD_FUNCIONARIO != null"
            size="large"
            color="primary"
            @click="actions.openModalVendasDetalhes(item.LOGIN, item.COD_FUNCIONARIO)"
          >
            mdi-information
          </v-icon>
        </template>
      </v-data-table>

      <div class="pt-2 btnsGraficoPrint">
        <v-btn
          color="primary"
          @click="actions.openModalVendasGraficos"
          :disabled="state.dbVendas.length <= 0"
        >
          <v-icon
            size="20px"
            class="mr-2"
          >
            mdi-chart-bar
          </v-icon>
          GRÁFICOS
        </v-btn>
        <v-btn
          color="primary"
          @click="actions.imprimirVendas"
          :disabled="state.dbVendas.length <= 0"
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
    </v-card>

    <div
      id="modalVendasDetalhes"
      style="display: none"
    >
      <ModalVendasDetalhes
        :dbVendasDetalhes="state.dbVendasDetalhes"
        :modalOpened="state.modalVendasDetalhesOpened"
      />
    </div>

    <div
      id="modalVendasGraficos"
      style="display: none"
    >
      <ModalVendasGraficos
        :modalOpened="state.modalVendasGraficosOpened"
        :dataInicial="state.dataInicialModal"
        :dataFinal="state.dataFinalModal"
      />
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

    <div id="pnCodigoTela">VENDA_POR_VENDEDOR</div>
  </v-container>
</template>

<style scoped>
.inputs {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.inputData {
  width: 128px;
}

.custom-table {
  background-color: #f0f0f0;
}

.btnsGraficoPrint {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
