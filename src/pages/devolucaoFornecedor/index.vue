<script setup lang="ts">
import { nextTick, onUnmounted } from "vue";
import { state, actions, notasAgrupadas, somaTotalItens } from "./devolucaoFornecedor";
import { useEventListener } from "@vueuse/core";

import ModalLocalizarDevolucao from "./components/ModalLocalizarDevolucao.vue";
import ModalSelecionarFornecedor from "./components/ModalSelecionarFornecedor.vue";
import ModalTransportadora from "./components/ModalTransportadora.vue";
import ModalEscolherItem from "./components/ModalEscolherItem.vue";

import utils from "@/ts/utils";
import moment from "moment";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (!state.modalOpened) {
    if (event.key === "F1") {
      const button = document.getElementById("btnLocalizarDevolucao");
      button.click();
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === "F2") {
      const button = document.getElementById("btnSelecionarFornecedor");
      button.click();
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === "F3") {
      const button = document.getElementById("btnEscolherItem");
      button.click();
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === "F6") {
      const button = document.getElementById("btnFinalizarDevolucao");
      button.click();
      event.preventDefault();
      event.stopPropagation();
    }
  }
});

nextTick(async () => {
  actions.init();
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-4"
      style="margin: 0 auto"
      width="1164px"
      height="728px"
    >
      <div class="btns">
        <v-btn
          id="btnLocalizarDevolucao"
          color="#3680AB"
          @click="actions.openModalLocalizarDevolucoes"
        >
          Localizar devolução (F1)
        </v-btn>
        <v-btn
          id="btnSelecionarFornecedor"
          color="#3680AB"
          @click="actions.openModalSelecionarFornecedor"
        >
          Nova devolução (F2)
        </v-btn>
      </div>
      <div class="pt-5">
        <v-row>
          <v-col cols="7">
            <h2 class="pb-2 font-weight-regular">Dados do Fornecedor</h2>
            <div class="container"
              ><v-row>
                <v-col cols="3">
                  <label>CNPJ: </label>
                  <p>{{ state.dbDevolucao.CGC_FORNECEDOR || "-" }}</p>
                </v-col>
                <v-col>
                  <label>Fornecedor: </label>
                  <p>{{ state.dbDevolucao.RAZAO_SOCIAL || "-" }}</p>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col>
            <h2 class="pb-2 font-weight-regular">Notas vinculadas ({{ notasAgrupadas.length }})</h2>
            <div class="container notas_vinculadas">
              <span v-if="notasAgrupadas.length == 0">Nenhuma nota vinculada, necessário adicionar itens!</span>
              <v-card
                v-if="state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR"
                v-for="notas in notasAgrupadas"
              >
                <div class="card_nota pa-2">
                  <span>{{ notas.NUM_NOTA }}</span>
                  <p>{{ utils.dataBrasil(notas.DATA_EMISSAO) }}</p>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- componente dados da transportadora -->
      <div class="pt-5">
        <h2 class="pb-2 font-weight-regular">Dados da Transportadora</h2>
        <div class="container">
          <v-row>
            <v-col cols="6">
              <label>Nome:</label>
              <p>{{ state.dbDevolucao.NOME_TRANSPORTADORA || "-" }}</p>
            </v-col>
            <v-col cols="4">
              <label>Frete por conta:</label>
              <p>{{ actions.fretePorConta(state.dbDevolucao.TIPO_FRETE) || "-" }}</p>
            </v-col>
            <v-col>
              <label>Valor:</label>
              <p>{{ utils.formatValor(state.dbDevolucao.VALOR_FRETE) }}</p>
            </v-col>
            <v-col>
              <button
                v-if="state.dbDevolucao.STATUS == 0"
                @click="actions.openModalTransportadora"
              >
                <v-icon
                  size="25px"
                  color="#2d9cdb"
                >
                  {{ state.dbDevolucao.ID_TRANSPORTADORA ? "mdi-pencil" : "mdi-plus-circle-outline" }}
                </v-icon>
              </button>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- componente dados da devolucao -->
      <div class="pt-5">
        <h2 class="pb-2 font-weight-regular">Dados da Devolução</h2>
        <div class="container">
          <v-row>
            <v-col cols="2">
              <label>N° Nota:</label>
              <p>{{ state.dbDevolucao.NUM_NOTA_DEVOLUCAO || "-" }}</p>
            </v-col>
            <v-col cols="5">
              <label>Chave:</label>
              <p>{{ utils.formatarChaveNF(state.dbDevolucao.CHAVE_DEVOLUCAO) }}</p>
            </v-col>
            <v-col cols="3">
              <label>Data:</label>
              <p>{{ utils.dataBrasil(state.dbDevolucao.DATA) || "-" }}</p>
            </v-col>
            <v-col>
              <label>Valor:</label>
              <p>{{ utils.formatValor(somaTotalItens) }}</p>
            </v-col>
          </v-row>
        </div>
      </div>
      <div
        class="pt-5"
        style="min-height: 210px"
      >
        <h2 class="pb-2 font-weight-regular">Itens</h2>
        <div class="cards">
          <v-card
            v-if="state.dbDevolucao.STATUS != 1"
            :disabled="state.disabledBtnAdicionarItens"
            @click="actions.openModalEscolherItem"
            class="card card_escolher_item"
          >
            <button id="btnEscolherItem">
              <v-icon size="25px"> mdi-plus-circle-outline </v-icon>
            </button>
            <p> NOVO ITEM (F3) </p>
          </v-card>
          <v-card
            v-for="itens in state.dbItensDevolucao"
            class="card pa-6"
            :key="itens.ID_DEVOLUCAO_FORNECEDOR_ITEM"
          >
            <v-row class="card_item">
              <span>{{ itens.DESCRICAO }}</span>
              <button
                v-if="state.dbDevolucao.STATUS != 1"
                title="DELETAR ITEM"
                @click="actions.deleteItemDevolucao(itens.ID_DEVOLUCAO_FORNECEDOR_ITEM)"
                ><v-icon size="20px">mdi-delete</v-icon>
              </button>
            </v-row>
            <v-row class="d-flex justify-space-between mt-6">
              <span>NF: {{ itens.NUM_NOTA }}</span>
              <span>{{ itens.QTD }}x {{ utils.formatValor(itens.VALOR_UNITARIO) }}</span>
              <span
                class="font-weight-bold"
                style="font-size: 16px"
                >{{ utils.formatValor(itens.VALOR_TOTAL) }}</span
              >
            </v-row>
          </v-card>
        </div>
      </div>

      <div class="btns pt-5">
        <div class="d-flex flex-wrap ga-2">
          <v-btn
            color="#3680AB"
            v-if="state.dbDevolucao.STATUS != 1"
            title="DELETAR DEVOLUÇÃO"
            :disabled="state.disabledBtnDelete"
            @click="actions.deleteDevolucao"
            ><v-icon size="24px">mdi-delete</v-icon>
          </v-btn>
          <v-btn
            color="#3680AB"
            :disabled="state.disabledBtnPrint"
          >
            <v-icon
              size="24px"
              class="mr-2"
              >mdi-printer</v-icon
            >{{ state.dbDevolucao.STATUS == 1 ? "Imprimir" : "Prévia" }}</v-btn
          >
        </div>
        <span
          v-if="state.dbDevolucao.STATUS == 1"
          class="font-weight-medium"
          >Devolução finalizada por: {{ state.dbDevolucao.LOGIN }} -
          {{ utils.dataBrasil(state.dbDevolucao.DATA) }} -
          {{ moment(state.dbDevolucao.HORA_FINALIZOU).format("HH:mm") }}
        </span>
        <v-btn
          color="#3680AB"
          :disabled="state.disabledBtnFinalizar"
          title="FINALIZAR DEVOLUÇÃO"
          id="btnFinalizarDevolucao"
          @click="actions.finalizarDevolucao"
        >
          Finalizar (F6)
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
        >
        </v-progress-circular>
      </v-overlay>

      <div
        id="modalLocalizarDevolucoes"
        style="display: none"
        title="Selecionar Devolução"
      >
        <ModalLocalizarDevolucao
          @devolucaoSelecionado="actions.getDevolucao"
          @closeModalLocalizarDevolucoes="actions.closeModalLocalizarDevolucoes"
          :modalOpened="state.modalLocalizarDevolucoesOpened"
        ></ModalLocalizarDevolucao>
      </div>

      <div
        id="modalSelecionarFornecedor"
        style="display: none"
        title="Selecionar Fornecedor"
      >
        <ModalSelecionarFornecedor
          @closeModalSelecionarFornecedor="actions.closeModalSelecionarFornecedor"
          @selecionarFornecedor="actions.getDevolucao"
          :modalOpened="state.modalSelecionarFornecedorOpened"
        ></ModalSelecionarFornecedor>
      </div>

      <div
        id="modalTransportadora"
        style="display: none"
        title="Transportadora"
      >
        <ModalTransportadora
          :id_devolucaoFornecedorTransp="state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR_TRANSP"
          :id_devolucaoFornecedor="state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR"
          :modalOpened="state.modalTransportadoraOpened"
          @closeModalTransportadoras="actions.closeModalTransportadora"
          @selecionarTransportadoraDevolucao="actions.getDevolucao"
        ></ModalTransportadora>
      </div>

      <div
        id="modalEscolherItem"
        style="display: none"
        title="Escolher item"
      >
        <ModalEscolherItem
          :id_fornecedor="state.dbDevolucao.ID_FORNECEDOR"
          :modalOpened="state.modalEscolherItemOpened"
          :id_devolucaoFornecedor="state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR"
          @closeModal="actions.closeModalEscolherItem"
          @getDevolucao="actions.getDevolucao(state.dbDevolucao)"
        ></ModalEscolherItem>
      </div>
    </v-card>
  </v-container>

  <div id="pnCodigoTela">DEVOLUCAO_FORNECEDOR</div>
</template>

<style scoped>
h2 {
  font-size: 14px;
}
.btns {
  display: flex;
  justify-content: space-between;
}

.container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  height: 80px;
  display: flex;
  align-items: center;
}

.container button {
  padding-top: 2px;
}

.container span {
  color: #2d9cdb;
  font-size: medium;
}

.container p {
  font-weight: bold;
}

.card {
  width: 340px;
  height: 77px;
  border-radius: 8px;
  background-color: #d9d9d9;
  display: flex;
  flex-direction: column;
}

.card_escolher_item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #2d9cdb;
  margin-bottom: 4px;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow: auto;
  height: 172px;
}

.card_nota {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #2d9cdb;
  height: 54px;
}

.card_nota span {
  color: #f2f2f2;
  font-weight: 700;
}

.card_nota p {
  color: #f2f2f2;
}

.notas_vinculadas {
  gap: 4px;
  overflow: auto;
  flex-wrap: wrap;
}

.card_item {
  display: flex;
  justify-content: space-between;
}

.card_item span {
  color: #000000;
  font-weight: 700;
  display: inline-block;
  width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card_item button {
  top: 80px;
}
</style>
