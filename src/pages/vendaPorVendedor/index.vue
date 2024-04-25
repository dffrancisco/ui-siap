<script setup lang="ts">
import moment from "moment";
import { state, actions, vendasOrdenadas, dadosToPrint } from "./vendaPorVendedor";
import { nextTick } from "vue";
import ModalVendasDetalhes from "./components/ModalVendasDetalhes.vue";
import ModalVendasGraficos from "./components/ModalVendasGraficos.vue";
import ModalImprimirVendas from "./components/ModalImprimirVendas.vue";

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
        <div>
          <h3 v-if="state.dbGrupoImpressao.length > 0"> Grupos selecionados para impressão: </h3>
          <div
            class="chip-container"
            v-if="state.dbGrupoImpressao.length > 0"
          >
            <v-chip-group
              v-model="state.grupoSelecionado"
              multiple
            >
              <v-chip
                v-for="grupo in state.dbGrupoImpressao"
                color="primary"
                variant="tonal"
                >{{ grupo.NOME }}</v-chip
              >
            </v-chip-group>
          </div>
        </div>

        <div class="data-container">
          <div class="input-data">
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
          <div class="input-data">
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
      </div>
      <v-data-table
        :headers="state.headers"
        :items="vendasOrdenadas"
        style="text-transform: none"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        class="ss custom-table"
        height="428"
        items-per-page="50"
        fixed-header
      >
        <template v-slot:item.VALOR_DEVOLUCAO="{ value }">
          <span style="color: #bf3f3f"> -{{ value }} </span>
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
        <div>
          <v-btn
            color="primary"
            @click="actions.openModalVendasGraficos"
            :disabled="state.dbVenda.length <= 0"
            icon="mdi-chart-bar"
            size="36px"
            title="Gráficos"
            class="mr-3"
          />
        </div>
        <v-btn
          color="primary"
          @click="actions.openModalImprimirVendas"
          :disabled="vendasOrdenadas.length <= 0"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
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

    <div
      id="modalImprimirVendas"
      style="display: none"
    >
      <ModalImprimirVendas
        :vendas="dadosToPrint"
        :modalOpened="state.modalImprimirVendasOpened"
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
  justify-content: space-between;
  align-items: flex-end;
}

.input-data {
  width: 126px;
}

.custom-table {
  background-color: #f0f0f0;
}

.btnsGraficoPrint {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.data-container {
  display: flex;
  gap: 12px;
}

.chip-container {
  overflow: auto;
  max-height: 80px;
  max-width: 500px;
}
</style>
