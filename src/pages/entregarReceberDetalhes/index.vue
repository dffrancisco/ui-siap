<script setup lang="ts">
import utils from "@/ts/utils";
import {
  state,
  actions,
  horaFormatada,
  disableEdtObservacao,
  disableBotaoEditarObservacao,
  motoristaAtual,
} from "./entregarReceberDetalhes";

import { useRoute } from "vue-router";
import ModalTrocaMotorista from "./components/modalTrocaMotorista.vue";
import ModalEscolherOrcamento from "./components/modalEscolherOrcamento.vue";
import ModalOpcoesPagamento from "./components/modalOpcoesPagamento.vue";
import xAuthUser from "@/plugins/xAuthUser/index.vue";

const route = useRoute();

actions.init(route);
</script>

<template>
  <v-main>
    <v-container>
      <v-card
        max-width="1000"
        class="mx-auto pa-3"
      >
        <v-card-text>
          <v-btn
            color="primary"
            variant="text"
            density="compact"
            class="mb-4 pa-0"
            icon="mdi-arrow-left"
            @click="actions.onClickVoltar"
          />
          <v-row>
            <v-col cols="2">
              <v-text-field
                type="number"
                hide-details
                label="Nº Orçamento"
                v-model="state.edtNumOrcamento"
                clearable
                @click:clear="actions.getEntregarReceber"
                @keypress.enter="actions.getEntregarReceber"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                hide-details
                variant="outlined"
                density="compact"
                label="Motorista"
                :items="state.motoristasComPendencia"
                item-title="NOME_MOTORISTA"
                item-value="COD_FUNCIONARIO"
                v-model="state.edtMotorista"
                @update:model-value="actions.getEntregarReceber"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                hide-details
                variant="outlined"
                density="compact"
                label="Tipo Pagamento"
                :items="state.itensTipoPagamento"
                item-title="DESCRICAO_TIPO_PAGAMENTO"
                item-value="ID_TIPO_PAGAMENTO"
                v-model="state.edtTipoPagamento"
                @update:model-value="actions.getEntregarReceber"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-btn
                icon
                color="primary"
                size="small"
                @click="actions.getEntregarReceber"
              >
                <v-icon> mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="7">
              <div class="dados-orcamento">
                <strong>Dados do Orçamento</strong>
                <v-row class="mt-1">
                  <v-col
                    cols="8"
                    class="dados-orcamento__cliente"
                  >
                    <span>Cliente:</span>
                    <strong class="ml-2">
                      {{ state.entregarReceber.CLIENTE }}
                    </strong>
                  </v-col>
                  <v-col cols="4">
                    <span>Nº Orçamento:</span>
                    <strong class="ml-2">
                      {{ state.entregarReceber.NUM_ORCAMENTO }}
                    </strong>
                  </v-col>
                  <v-col cols="3">
                    <span>Data:</span>
                    <strong class="ml-2">
                      {{ utils.dataBrasil(state.entregarReceber.DATA) }}
                    </strong>
                  </v-col>
                  <v-col cols="3">
                    <span>Hora:</span>
                    <strong class="ml-2">
                      {{ horaFormatada }}
                    </strong>
                  </v-col>
                  <v-col cols="6">
                    <span>Vendedor:</span>
                    <strong class="ml-2">
                      {{ state.entregarReceber.VENDEDOR }}
                    </strong>
                  </v-col>
                  <v-col cols="3">
                    <span>Valor:</span>
                    <strong class="ml-2">
                      {{ utils.formatValor(state.entregarReceber.VALOR) }}
                    </strong>
                  </v-col>
                  <v-col cols="3">
                    <span>Tipo Pgto:</span>
                    <strong class="ml-2">
                      {{ state.entregarReceber.TIPO_PAGAMENTO }}
                      <v-icon
                        size="x-small"
                        color="primary"
                        :title="state.entregarReceber.DESCRICAO_PAGAMENTO"
                      >
                        mdi-help-circle
                      </v-icon>
                    </strong>
                  </v-col>
                  <v-col cols="6">
                    <span>Motorista:</span>
                    <strong class="ml-2 mr-2">
                      {{ state.entregarReceber.NOME_MOTORISTA || "-" }}
                    </strong>
                    <v-icon
                      v-if="state.entregarReceber.NUM_ORCAMENTO"
                      color="primary"
                      icon="mdi-sync"
                      size="small"
                      title="Trocar motorista"
                      @click="actions.onClickTrocarMotorista"
                    ></v-icon>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="5">
              <strong>Observação</strong>
              <div class="d-flex">
                <v-textarea
                  rows="3"
                  hide-details
                  variant="outlined"
                  class="mr-2"
                  :disabled="disableEdtObservacao"
                  maxlength="1000"
                  v-model="state.edtObservacao"
                  id="edtObservacao"
                ></v-textarea>
                <div class="d-flex flex-column">
                  <v-btn
                    color="primary"
                    icon="mdi-pen"
                    size="x-small"
                    title="Alterar"
                    class="mb-2"
                    :disabled="disableBotaoEditarObservacao"
                    @click="actions.onClickEditarObservacao"
                  ></v-btn>
                  <v-btn
                    color="success"
                    icon="mdi-check"
                    size="x-small"
                    title="Salvar"
                    :disabled="!state.editandoObservacao"
                    @click="actions.onClickSalvarObservacao"
                  ></v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-progress-linear
                color="primary"
                v-model="state.timeAuth"
                max="6000"
              ></v-progress-linear>
              <div id="gridEntregarReceber"></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="9"
              class="d-flex justify-space-between"
            >
              <v-btn
                color="primary"
                icon="mdi-printer"
                size="small"
                title="Imprimir"
                @click="actions.onClickImprimir"
              ></v-btn>
            </v-col>
            <v-col cols="3">
              <div class="d-flex">
                <v-text-field
                  id="edtNumOrcamentoPendencia"
                  hide-details
                  label="Nº Orçamento"
                  class="mr-2"
                  autofocus
                  v-model="state.edtNumOrcamentoPendencia"
                  @keypress.enter="actions.validarOrcamento(undefined)"
                ></v-text-field>
                <v-btn
                  icon="mdi-account-arrow-right"
                  color="primary"
                  title="Remover pendência motorista"
                  size="small"
                  @click="actions.validarOrcamento(undefined)"
                >
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-overlay
        :model-value="state.loading || state.loadingGrid"
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

    <div
      id="modalTrocaMotorista"
      title="Trocar motorista"
      style="display: none"
    >
      <modal-troca-motorista
        :motoristas="state.motoristas"
        :motoristaAtual="motoristaAtual"
        @trocarMotorista="actions.trocarMotorista"
      />
    </div>

    <div
      id="modalEscolherOrcamento"
      title="Escolher orçamento"
      style="display: none"
    >
      <modal-escolher-orcamento
        :orcamentos="state.orcamentosParaEscolher"
        @cancelar="actions.cancelarEscolhaOrcamento"
        @orcamentoEscolhido="actions.escolherOrcamento"
      />
    </div>

    <div
      id="modalOpcoesPagamento"
      title="Opções de pagamento"
      style="display: none"
    >
      <modal-opcoes-pagamento
        :orcamento="state.orcamentoBaixa"
        :opened="state.modalOpcoesPagamentoOpened"
        :cartoesDisponiveis="state.cartoesDisponiveis"
        @cancelar="actions.fecharModalPagamento"
        @finalizar="actions.baixarEntregarReceber"
      />
    </div>

    <x-auth-user />
  </v-main>

  <div id="pnCodigoTela">entregarReceberDetalhes</div>
</template>

<style lang="scss" scoped>
.dados-orcamento {
  &__cliente {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
