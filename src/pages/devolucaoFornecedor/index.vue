<script setup lang="ts">
import { nextTick, onUnmounted } from "vue";
import { state, actions } from "./devolucaoFornecedor";
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
      const button = document.getElementById("meuBotao");
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
      class="pa-5"
      style="margin: 0 auto"
      width="1167px"
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

      <!-- componente dados do fornecedor /-->
      <div class="pt-5">
        <v-row>
          <v-col>
            <h2 class="pb-2 font-weight-regular">Dados do Fornecedor</h2>
            <div class="container"
              ><v-row>
                <v-col cols="3">
                  <label>CNPJ: </label>
                  <p>{{ state.dbFornecedor.CGC_FORNECEDOR || "-" }}</p>
                </v-col>
                <v-col>
                  <label>Fornecedor: </label>
                  <p>{{ state.dbFornecedor.RAZAO_SOCIAL || "-" }}</p>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col>
            <h2 class="pb-2 font-weight-regular">Notas vinculadas (0)</h2>
            <div class="container">
              <span>Nenhuma nota vinculada, necessário adicionar itens!</span>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- componente dados da transportadora -->
      <div class="pt-5">
        <h2 class="pb-2 font-weight-regular">Dados da Transportadora</h2>
        <div class="container">
          <v-row>
            <v-col cols="7">
              <label>Nome:</label>
              <p>{{ state.dbTransportadoraDevolucao.NOME_TRANSPORTADORA || "-" }}</p>
            </v-col>
            <v-col cols="3">
              <label>Frete por conta:</label>
              <p>{{ actions.fretePorConta(state.dbTransportadoraDevolucao.TIPO_FRETE) || "-" }}</p>
            </v-col>
            <v-col>
              <label>Valor:</label>
              <p>{{ utils.formatValor(state.dbTransportadoraDevolucao.VALOR_FRETE) || "-" }}</p>
            </v-col>
            <v-col>
              <button
                :disabled="state.disabledBtnAdicionarTransportadora"
                v-if="state.dbDevolucao.STATUS != 1"
                @click="actions.openModalTransportadora"
              >
                <v-icon
                  size="25px"
                  color="#2d9cdb"
                >
                  {{
                    state.dbTransportadoraDevolucao.ID_TRANSPORTADORA ? "mdi-pencil" : "mdi-plus-circle-outline"
                  }}
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
              <p>{{ utils.formatValor(state.dbDevolucao.VALOR) || "-" }}</p>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- componente itens -->
      <div
        class="pt-5"
        style="min-height: 210px"
      >
        <h2 class="pb-2 font-weight-regular">Itens</h2>
        <div class="cards">
          <v-card
            v-if="state.dbDevolucao.STATUS != 1"
            v-for="i in 1"
            :key="i"
            class="card"
          >
            <button
              :disabled="state.disabledBtnAdicionarItens"
              @click="actions.openModalEscolherItem"
              id="btnEscolherItem"
            >
              <v-icon size="25px"> mdi-plus-circle-outline </v-icon>
            </button>
            <p> NOVO ITEM (F3) </p>
          </v-card>
          <v-card></v-card>
        </div>
      </div>

      <div class="btns pt-5">
        <div class="d-flex flex-wrap ga-2">
          <v-btn
            color="#3680AB"
            v-if="state.dbDevolucao.STATUS != 1"
            title="DELETAR DEVOLUÇÃO"
            :disabled="state.disabledBtnDelete"
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
          :id_devolucaoFornecedorTransp="state.dbTransportadoraDevolucao.ID_DEVOLUCAO_FORNECEDOR_TRANSP"
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
          :idFornecedor="state.dbFornecedor.ID_FORNECEDOR"
          :modalOpened="state.modalEscolherItemOpened"
          @closeModal="actions.closeModalEscolherItem"
        ></ModalEscolherItem>
      </div>
    </v-card>
  </v-container>

  <div id="pnCodigoTela">DEVOLUCAO_FORNECEDOR</div>
</template>

<style scoped>
h2 {
  font-size: 16px;
}
.btns {
  display: flex;
  justify-content: space-between;
}

.container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  min-height: 68px;
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

.card {
  width: 362px;
  height: 77px;
  border-radius: 8px;
  background-color: #d9d9d9;
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
  height: 184px;
}
</style>
