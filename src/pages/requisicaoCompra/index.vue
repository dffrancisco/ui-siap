<script setup lang="ts">
import utils from "@/ts/utils";
import { actions, state } from "./requisicaoCompra";
import ModalNovaRequisicao from "./components/ModalNovaRequisicao.vue";
import { useEventListener } from "@vueuse/core";
import { onUnmounted } from "vue";
import ModalLocalizarRequisicao from "./components/ModalLocalizarRequisicao.vue";
import moment from "moment";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (!state.modalLocalizarRequisicaoOpened && !state.modalNovaRequisicaoOpened) {
    if (event.key === "F1") {
      state.modalLocalizarRequisicaoOpened = true;
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === "F2") {
      state.modalNovaRequisicaoOpened = true;
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === "F6") {
      if (state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA) {
        actions.btnFinalizarRequisicaoCompra();
      }

      event.preventDefault();
      event.stopPropagation();
    }
  }
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <v-card
      class="ma-auto pa-4 d-flex flex-column"
      width="900"
      height="550"
    >
      <div class="d-flex justify-space-between">
        <v-btn
          @click="state.modalLocalizarRequisicaoOpened = true"
          color="primary"
          >Localizar Requisição (F1)</v-btn
        >
        <v-btn
          color="primary"
          @click="state.modalNovaRequisicaoOpened = true"
          >Nova Requisição (F2)</v-btn
        >
      </div>

      <div class="mt-4">
        <v-row>
          <v-col cols="9">
            <div class="pa-3 rounded-lg containerDadosRequisicao">
              <v-row>
                <v-col cols="2">
                  <div class="d-flex flex-column">
                    <strong>Data:</strong>
                    <span>{{ utils.dataBrasil(state.dbRequisicaoCompra.DATA_HORA_CRIACAO) || "-" }}</span>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="d-flex flex-column">
                    <strong>CNPJ:</strong>
                    <span>{{ state.dbRequisicaoCompra.CNPJ_FAVORECIDO || "-" }}</span>
                  </div>
                </v-col>
                <v-col>
                  <div class="d-flex flex-column">
                    <strong>Razão Social:</strong>
                    <span>{{ state.dbRequisicaoCompra.NOME_FAVORECIDO || "-" }}</span>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col>
            <div class="pa-3 rounded-lg containerDadosRequisicao">
              <v-row>
                <v-col>
                  <div class="d-flex flex-column">
                    <strong>Qtd. Itens:</strong>
                    <span>{{ state.dbRequisicaoItens.length }}</span>
                  </div>
                </v-col>
                <v-col>
                  <div class="d-flex flex-column">
                    <strong>Valor:</strong>
                    <span>{{ utils.formatValor(state.dbRequisicaoCompra.VALOR) }}</span>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="d-flex flex-grow-1 mt-4 flex-column">
        <div class="d-flex align-center justify-space-between">
          <h2>Itens:</h2>
        </div>

        <div
          class="mt-2 d-flex flex-wrap ga-4"
          style="overflow: auto; max-height: 300px"
        >
          <v-card
            color="#91d2f7"
            width="270"
            height="80"
            class="d-flex justify-center align-center rounded-lg"
            style="cursor: pointer"
            :style="{ cursor: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA ? 'pointer' : 'zoom-in' }"
          >
            <div
              class="d-flex flex-column align-center"
              style="color: #52525b; font-size: 12px"
            >
              <v-icon size="24">mdi-plus-circle-outline</v-icon>
              <span>NOVO ITEM (F3)</span>
            </div>
          </v-card>

          <v-card
            v-for="item in state.dbRequisicaoItens"
            color="#91d2f7"
            width="270"
            height="80"
            class="d-flex flex-column pa-2 justify-space-between rounded-lg"
          >
            <div class="d-flex justify-space-between flex-grow-1">
              <div>
                <strong
                  class="elipsys-text"
                  :style="{ maxWidth: item.COD_PRODUTO ? '250px' : '200px' }"
                  >{{ item.DESCRICAO }}</strong
                >
              </div>

              <div>
                <v-chip
                  color="success"
                  variant="flat"
                  size="x-small"
                  v-if="!item.COD_PRODUTO"
                >
                  NOVO
                </v-chip>
              </div>
            </div>

            <div class="d-flex justify-space-between align-center">
              <div class="d-flex ga-2">
                <v-icon
                  style="cursor: pointer"
                  title="Deletar Item"
                  >mdi-delete</v-icon
                >
                <v-icon
                  style="cursor: pointer"
                  title="Alterar Item"
                  >mdi-pencil</v-icon
                >
              </div>

              <div>
                <span> {{ item.QTD }}x{{ utils.formatValor(item.VALOR_UNITARIO) }} </span>
              </div>

              <div>
                <strong class="text-h5">{{ utils.formatValor(item.TOTAL) }}</strong>
              </div>
            </div>
          </v-card>
        </div>
      </div>

      <div class="d-flex justify-space-between align-center">
        <div>
          <v-btn
            v-if="state.dbRequisicaoCompra.FINALIZADO == 'N'"
            :disabled="!state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA"
            color="#ef4444"
            @click="actions.btnDeleteRequisicaoCompra"
          >
            <v-icon class="mr-2">mdi-delete mdi-24px</v-icon> Deletar Requisição
          </v-btn>

          <v-btn
            v-else
            color="primary"
            :disabled="!state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA"
            ><v-icon class="mr-2">mdi-printer mdi-24px</v-icon> imprimir</v-btn
          >
        </div>

        <div v-if="state.dbRequisicaoCompra.COD_FUNCIONARIO_FINALIZOU">
          <span class="text-subtitle-2"
            >Requisição realizada por: {{ state.dbRequisicaoCompra.LOGIN_FUNCIONARIO_FINALIZOU }} -
            {{ utils.dataBrasil(state.dbRequisicaoCompra.DATA_HORA_FINALIZADO) }} -
            {{
              moment(state.dbRequisicaoCompra.DATA_HORA_FINALIZADO).locale("America/Sao_Paulo").format("HH:mm")
            }}</span
          >
        </div>

        <div>
          <v-btn
            :disabled="
              !state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA || state.dbRequisicaoCompra.FINALIZADO == 'S'
            "
            color="success"
            @click="actions.btnFinalizarRequisicaoCompra"
            >Finalizar Requisição (F6)</v-btn
          >
        </div>
      </div>
    </v-card>

    <v-dialog
      v-model="state.modalNovaRequisicaoOpened"
      width="650"
      height="510"
    >
      <ModalNovaRequisicao
        @selecionarFavorecido="actions.selecionarFavorecido"
        @closeModal="state.modalNovaRequisicaoOpened = false"
      />
    </v-dialog>

    <v-dialog
      v-model="state.modalLocalizarRequisicaoOpened"
      width="650"
      height="510"
    >
      <ModalLocalizarRequisicao
        @selecionarRequisicaoCompra="actions.selecionarRequisicaoCompra"
        @closeModal="state.modalLocalizarRequisicaoOpened = false"
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

    <div id="pnCodigoTela">requisicaoCompra</div>
  </v-container>
</template>

<style scoped>
.containerDadosRequisicao {
  border: 1px solid gray;
}

.containerDadosRequisicao strong,
.containerDadosRequisicao span {
  font-size: 12px;
}

.elipsys-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>
