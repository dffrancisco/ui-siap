<script lang="ts" setup>
import { onMounted } from "vue";
import CardParcelamento from "./components/CardParcelamento.vue";
import { actions, computeds, state } from "./regrasfaturamento";
import ModalCadastrarParcela from "./components/ModalCadastrarParcela.vue";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="600"
      class="pa-4 ma-auto"
    >
      <span class="text-subtitle-1">Dias para Faturamento</span>

      <div class="mt-4">
        <v-row>
          <v-col>
            <div>
              <v-text-field
                v-model="state.dbRegraFaturamento.FATURAMENTO_ATE_VALOR"
                v-mask-decimal.br="2"
                label="Faturamento Até"
                maxlength="15"
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

      <div class="mt-8">
        <div class="d-flex ga-2 align-center">
          <span class="text-subtitle-1">Parcelamentos</span>
          <v-btn
            color="primary"
            size="20"
            icon="mdi-plus"
            title="Novo parcelamento"
            @click="state.modalCadastrarParcelaOpened = true"
          ></v-btn>
        </div>

        <div class="mt-4">
          <CardParcelamento
            @deleteParcela="actions.deleteRegraFaturamentoParcela"
            :regraFaturamentoParcelas="state.dbRegraFaturamentoParcelas"
          />
        </div>
      </div>
      <div class="d-flex align-center justify-center mt-4 position-relative">
        <v-btn
          class="position-absolute left-0"
          size="x-small"
          color="primary"
          icon="mdi-account-star mdi-24px"
          title="Faturamento Exclusivo"
        />
        <div class="d-flex align-center justify-center ga-4">
          <v-btn
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
</style>
