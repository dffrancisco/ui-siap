<script setup lang="ts">
import { nextTick } from "vue";
import { actions, dataHoje, state } from "./devolucaoDePecas";
import ModalDetalhesItensDevolucao from "./components/modalDetalhesItensDevolucao.vue";

nextTick(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card class="pa-5 main-card">
      <div
        id="pnCampos"
        class="d-flex justify-end align-end ga-4 pb-4"
      >
        <div class="container-data">
          <label for="tipoData">Tipo de Data</label>
          <select
            id="tipoData"
            v-model="state.selectedTipoData"
            class="ss obr"
            style="height: 28px"
          >
            <option value="DATA_VENDA">Data Venda</option>
            <option value="DATA">Data Devolução</option>
          </select>
        </div>
        <div class="container-data">
          <span>Data Inicial</span>
          <input
            type="date"
            class="ss obr"
            v-model="state.dataInicio"
            :max="dataHoje"
            maxlength="10"
            @keyup.enter="state.inputElementDataFim.focus()"
          />
        </div>

        <div class="container-data">
          <span>Data Final</span>
          <input
            type="date"
            class="ss obr"
            id="DATA_FIM"
            v-model="state.dataFim"
            :max="dataHoje"
            maxlength="10"
            @keyup.enter="actions.buscarDevolucoes"
          />
        </div>
        <v-btn
          icon="mdi-magnify"
          color="primary"
          size="36"
          @click="actions.buscarDevolucoes"
        />
      </div>

      <v-data-table
        :headers="state.headers"
        :items="state.dbDevolucoes"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        height="480"
        items-per-page="50"
        fixed-header
        class="pb-4"
        :row-props="actions.getClassCorLinha"
      >
        <template v-slot:item.NF_DEVOLUCAO="{ item }">
          <div class="nf-container">{{ item.NF_DEVOLUCAO }}</div>
        </template>

        <template v-slot:item.inf="{ item }">
          <v-icon
            size="large"
            color="primary"
            title="Ver detalhes"
            @click="actions.openModalDetalhesItensDevolucao(item)"
          >
            mdi-information
          </v-icon>
        </template>
      </v-data-table>

      <div class="btnPrint">
        <v-btn
          icon="mdi-printer"
          color="primary"
          size="36"
          title="IMPRIMIR"
          :disabled="state.dbDevolucoes.length == 0"
          @click="actions.onClickImprimir"
        />
      </div>
    </v-card>

    <div id="pnCodigoTela">devolucaoDePecas</div>
  </v-container>

  <div
    id="modalDetalhesItensDevolucao"
    style="display: none"
  >
    <ModalDetalhesItensDevolucao
      :devolucaoSelecionada="state.detalhesDevolucaoSelecionada"
      :modalOpened="state.modalDetalhesItensDevolucaoOpened"
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
</template>

<style>
.cor-zebrada {
  background-color: #f5f5f5;
}

.nf-container {
  word-wrap: break-word;
  white-space: normal;
  width: 130px;
}

.v-data-table-footer {
  max-height: 50px;
  padding-right: 80px;
  padding-top: 15px;
}
</style>

<style scoped>
.main-card {
  margin: 0 auto;
  width: 1050px;
}

.container-data {
  width: 150px;
}

.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -45px;
  padding-right: 15px;
}
</style>
