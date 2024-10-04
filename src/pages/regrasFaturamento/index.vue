<script lang="ts" setup>
import { onMounted } from "vue";
import TableParcelamento from "./components/TableParcelamento.vue";
import { actions, computeds, state } from "./regrasfaturamento";
import ModalCadastrarParcela from "./components/ModalCadastrarParcela.vue";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import ModalFaturamentoExclusivo from "./components/ModalFaturamentoExclusivo.vue";
import ModalSelecionarClienteFaturado from "./components/ModalSelecionarClienteFaturado.vue";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="600"
      :class="{ borderCardClienteSelecionado: state.dbRegraFaturamento.ID_CLIENTE }"
      class="pa-4 ma-auto"
    >
      <div class="d-flex justify-space-between align-center">
        <span class="text-subtitle-1">Dias para Faturamento</span>
        <v-chip
          v-if="state.dbRegraFaturamento.ID_CLIENTE"
          size="small"
          color="success"
          class="font-weight-bold"
          >{{ state.dbRegraFaturamento.RAZAO_SOCIAL }}</v-chip
        >
      </div>

      <div class="mt-4">
        <v-row>
          <v-col>
            <div>
              <v-text-field
                v-model="state.dbRegraFaturamento.FATURAMENTO_ATE_VALOR"
                v-mask-decimal.br="2"
                label="Faturamento Até"
                maxlength="15"
                id="inputFaturamentoAte"
                :disabled="!state.btnAlterarActivated"
                :clearable="false"
              ></v-text-field>

              <div class="mt-2">
                <span> Prazo (Dias) </span>
                <div class="mt-2 d-flex ga-4">
                  <div
                    :class="{ containerInputPrazoHover: state.btnAlterarActivated }"
                    class="containerInputPrazo"
                  >
                    <input
                      v-model="state.dbRegraFaturamento.FATURAMENTO_ATE_PRAZO_1"
                      v-mask="'##'"
                      :disabled="!state.btnAlterarActivated"
                      maxlength="2"
                    />
                  </div>

                  <div
                    :class="{ containerInputPrazoHover: state.btnAlterarActivated }"
                    class="containerInputPrazo"
                  >
                    <input
                      v-model="state.dbRegraFaturamento.FATURAMENTO_ATE_PRAZO_2"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>

                  <div
                    :class="{ containerInputPrazoHover: state.btnAlterarActivated }"
                    class="containerInputPrazo"
                  >
                    <input
                      v-model="state.dbRegraFaturamento.FATURAMENTO_ATE_PRAZO_3"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col>
            <div>
              <v-text-field
                v-model="computeds.acimaDeValor.value"
                v-mask-decimal.br="2"
                label="Faturamento Acima De"
                maxlength="15"
                disabled
                :clearable="false"
              ></v-text-field>

              <div class="mt-2">
                <span> Prazo (Dias) </span>
                <div class="mt-2 d-flex ga-4">
                  <div
                    :class="{ containerInputPrazoHover: state.btnAlterarActivated }"
                    class="containerInputPrazo"
                  >
                    <input
                      class="pa-2"
                      v-model="state.dbRegraFaturamento.FATURAMENTO_ACIMA_DE_PRAZO_1"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>

                  <div
                    :class="{ containerInputPrazoHover: state.btnAlterarActivated }"
                    class="containerInputPrazo"
                  >
                    <input
                      v-model="state.dbRegraFaturamento.FATURAMENTO_ACIMA_DE_PRAZO_2"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>

                  <div
                    :class="{ containerInputPrazoHover: state.btnAlterarActivated }"
                    class="containerInputPrazo"
                  >
                    <input
                      v-model="state.dbRegraFaturamento.FATURAMENTO_ACIMA_DE_PRAZO_3"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <div
        class="mt-8"
        v-if="!state.dbRegraFaturamento.ID_CLIENTE"
      >
        <div class="d-flex ga-2 align-center">
          <span class="text-subtitle-1">Parcelamentos</span>
          <v-btn
            color="primary"
            size="20"
            icon="mdi-plus"
            title="Novo parcelamento"
            @click="actions.openModalCadastrarParcela"
          ></v-btn>
        </div>

        <div class="mt-4">
          <TableParcelamento
            @deleteParcela="actions.deleteRegraFaturamentoParcela"
            :regraFaturamentoParcelas="state.dbRegraFaturamentoParcelas"
            @editParcela="actions.openModalCadastrarParcelaToEdit"
          />
        </div>
      </div>
      <div class="d-flex align-center justify-center mt-8 position-relative">
        <v-btn
          class="position-absolute left-0"
          size="x-small"
          v-if="!state.dbRegraFaturamento.ID_CLIENTE"
          :disabled="state.btnAlterarActivated"
          color="primary"
          @click="actions.openModalFaturamentoExclusivo"
          icon="mdi-account-star mdi-24px"
          title="Faturamento Exclusivo"
        />
        <div class="d-flex align-center justify-center ga-4">
          <v-btn
            v-if="!state.dbRegraFaturamento.ID_CLIENTE"
            size="small"
            color="primary"
            :disabled="state.btnAlterarActivated"
            @click="actions.btnAlterar"
          >
            Alterar
          </v-btn>
          <v-btn
            size="small"
            color="primary"
            @click="actions.btnSave"
            :disabled="!state.btnAlterarActivated"
          >
            Salvar
          </v-btn>
          <v-btn
            :disabled="!state.btnAlterarActivated"
            size="small"
            color="primary"
            @click="actions.btnCancelar"
          >
            Cancelar
          </v-btn>
        </div>
      </div>
    </v-card>
    <div id="pnCodigoTela">regrasFaturamento</div>
  </v-container>

  <v-dialog
    v-model="state.modalCadastrarParcelaOpened"
    max-width="600"
  >
    <ModalCadastrarParcela
      @insertParcela="actions.insertRegraFaturamentoParcela"
      @closeModal="state.modalCadastrarParcelaOpened = false"
      :dbParcelaToEdit="state.dbRegraFaturamentoParcelaToEdit"
      @updateParcela="actions.updateRegraFaturamentoParcela"
    />
  </v-dialog>

  <v-dialog
    v-model="state.modalFaturamentoExclusivoOpened"
    max-width="650"
  >
    <ModalFaturamentoExclusivo
      @selecionarFaturamentoExclusivo="actions.getFaturamentoExclusivo"
      @closeModal="state.modalFaturamentoExclusivoOpened = false"
      @openModalSelecionarCliente="state.modalSelecionarClienteFaturadoOpened = true"
    />
  </v-dialog>

  <v-dialog
    v-model="state.modalSelecionarClienteFaturadoOpened"
    max-width="650"
  >
    <ModalSelecionarClienteFaturado
      @closeModal="state.modalSelecionarClienteFaturadoOpened = false"
      @selecionarCliente="actions.selecionarClienteFaturado"
    />
  </v-dialog>

  <modalXAuthManager />

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

<style scoped>
.containerInputPrazo {
  display: flex;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid gray;
  width: 36px;
}

.containerInputPrazo:focus-within {
  border: 1px solid #26c6da !important;
}

.containerInputPrazoHover:hover {
  border: 1px solid var(--grey-minus-100);
}

.containerInputPrazo input {
  padding: 8px;
  width: 30px;
  text-align: center;
}

.borderCardClienteSelecionado {
  border: 1px solid green;
}
</style>
