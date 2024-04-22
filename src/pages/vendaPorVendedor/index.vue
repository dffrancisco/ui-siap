<script setup lang="ts">
import moment from "moment";
import { state, actions, vendasOrdenadas } from "./vendaPorVendedor";
import { nextTick } from "vue";
import ModalVendasDetalhes from "./components/ModalVendasDetalhes.vue";
import ModalVendasGraficos from "./components/ModalVendasGraficos.vue";
import ModalImprimirVendas from "./components/ModalImprimirVendas.vue";
import ModalGrupoFuncionarios from "./components/ModalGrupoFuncionarios.vue";
import ModalDadosGrupo from "./components/ModalDadosGrupo.vue";

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
            :disabled="state.dbVendas.length <= 0"
            icon="mdi-chart-bar"
            size="36px"
            title="GRÁFICOS"
            class="mr-3"
          />
          <v-btn
            color="primary"
            @click="actions.openModalGrupoFuncionarios"
            :disabled="state.dbVendas.length <= 0"
            icon="mdi-account-multiple"
            size="36px"
            title="GRUPO DE FUNCIONÁRIOS"
          />
        </div>
        <v-btn
          color="primary"
          @click="actions.openModalImprimirVendas"
          :disabled="state.dbVendas.length <= 0"
          icon="mdi-printer"
          size="36px"
          title="IMPRIMIR"
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
        :vendas="state.dbVendas"
        :modalOpened="state.modalImprimirVendasOpened"
        :dataInicial="state.dataInicialModal"
        :dataFinal="state.dataFinalModal"
      />
    </div>

    <div
      id="modalGrupoFuncionarios"
      style="display: none"
    >
      <ModalGrupoFuncionarios
        @closeModal="actions.closeModalGrupoFuncionarios"
        @openModalDadosGrupo="actions.openModalDadosGrupo"
        @editarGrupo="actions.openModalDadosGrupoEdit"
        :modalOpened="state.modalGrupoFuncionariosOpened"
      />
    </div>

    <div
      id="modalDadosGrupo"
      style="display: none"
    >
      <ModalDadosGrupo
        :dadosGrupoEdit="state.dadosGrupoEdit"
        :nomeGrupoEdit="state.nomeGrupoEdit"
        :modalOpened="state.modalDadosGrupoOpened"
        :dadosGrupoEditOpened="state.dadosGrupoEditOpened"
        @closeModal="actions.closeModalDadosGrupo"
        @salvarGrupo="actions.salvarGrupo"
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
  justify-content: space-between;
  gap: 8px;
}
</style>
