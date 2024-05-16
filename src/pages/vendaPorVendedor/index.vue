<script setup lang="ts">
import { state, actions, vendasOrdenadas, dadosToPrint, dataHoje } from "./vendaPorVendedor";
import { nextTick } from "vue";
import ModalVendasDetalhes from "./components/ModalVendasDetalhes.vue";
import ModalVendasGraficos from "./components/ModalVendasGraficos.vue";
import ModalImprimirVendas from "./components/ModalImprimirVendas.vue";
import utils from "@/ts/utils";

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
              :max="dataHoje"
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
              :max="dataHoje"
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
      <v-data-table-virtual
        :headers="state.headers"
        :items="vendasOrdenadas"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        height="480"
        items-per-page="50"
        fixed-header
      >
        <template v-slot:item.inf="{ item }">
          <v-icon
            v-if="item.COD_FUNCIONARIO != null"
            size="large"
            color="primary"
            title="Ver detalhes"
            @click="actions.openModalVendasDetalhes(item.LOGIN, item.COD_FUNCIONARIO)"
          >
            mdi-information
          </v-icon>
        </template>
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#fff' : '#f0f0f0', textAlign: 'end' }">
            <td style="text-align: start">{{ item.LOGIN }}</td>
            <td>{{ utils.formatValor(item.LIMITE) }}</td>
            <td>{{ utils.formatValor(item.VALOR_VENDA) }}</td>
            <td
              ><span style="color: #bf3f3f"> -{{ utils.formatValor(item.VALOR_DEVOLUCAO) }} </span></td
            >
            <td>{{ utils.formatValor(item.VENDA_LIQUIDA) }}</td>
            <td>{{ utils.formatValor(item.TICKET_MEDIO) }}</td>
            <td>{{ utils.formatValor(item.QTD_MEDIA_ITENS) }}</td>
            <td>
              <v-icon
                v-if="item.COD_FUNCIONARIO != null"
                size="large"
                color="primary"
                title="Ver detalhes"
                @click="actions.openModalVendasDetalhes(item.LOGIN, item.COD_FUNCIONARIO)"
              >
                mdi-information
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>

      <div class="pt-2 btnsGraficoPrint">
        <div>
          <v-btn
            color="primary"
            @click="actions.openModalVendasGraficos"
            :disabled="vendasOrdenadas.length <= 0"
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
  max-height: 88px;
  max-width: 500px;
}
</style>
