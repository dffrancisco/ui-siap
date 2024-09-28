<script lang="ts" setup>
import CardParcelamento from "./components/CardParcelamento.vue";
import { actions, state } from "./regrasfaturamento";
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
                v-mask-decimal.br="2"
                label="Faturamento Até"
                maxlength="15"
                :disabled="!state.btnAlterarActivated"
              ></v-text-field>

              <div class="mt-2">
                <span> Prazo (Dias) </span>
                <div class="mt-2 d-flex ga-4">
                  <div class="containerInputPrazo">
                    <input
                      v-model="state.prazos.prazoDiasAte1"
                      :clearable="false"
                      v-mask="'##'"
                      :disabled="!state.btnAlterarActivated"
                      maxlength="2"
                    />
                  </div>

                  <div class="containerInputPrazo">
                    <input
                      v-model="state.prazos.prazoDiasAte2"
                      :clearable="false"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>

                  <div class="containerInputPrazo">
                    <input
                      v-model="state.prazos.prazoDiasAte3"
                      :clearable="false"
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
                v-mask-decimal.br="2"
                label="Acima De"
                maxlength="15"
                :disabled="!state.btnAlterarActivated"
              ></v-text-field>

              <div class="mt-2">
                <span> Prazo (Dias) </span>
                <div class="mt-2 d-flex ga-4">
                  <div class="containerInputPrazo">
                    <input
                      class="pa-2"
                      v-model="state.prazos.prazoDiasAcimaDe1"
                      :clearable="false"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>

                  <div class="containerInputPrazo">
                    <input
                      v-model="state.prazos.prazoDiasAcimaDe2"
                      :clearable="false"
                      v-mask="'##'"
                      maxlength="2"
                      :disabled="!state.btnAlterarActivated"
                    />
                  </div>

                  <div class="containerInputPrazo">
                    <input
                      v-model="state.prazos.prazoDiasAcimaDe3"
                      :clearable="false"
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
          ></v-btn>
        </div>

        <div class="mt-4">
          <CardParcelamento />
        </div>
      </div>
      <div class="mt-4 d-flex justify-center ga-4">
        <v-btn
          size="small"
          color="primary"
          :disabled="state.btnAlterarActivated"
          @click="state.btnAlterarActivated = true"
        >
          Alterar
        </v-btn>
        <v-btn
          size="small"
          color="primary"
          @click=""
          :disabled="!state.btnAlterarActivated"
        >
          Salvar
        </v-btn>
        <v-btn
          :disabled="!state.btnAlterarActivated"
          size="small"
          color="primary"
          @click="state.btnAlterarActivated = false"
        >
          Cancelar
        </v-btn>
      </div>
    </v-card>
    <div id="pnCodigoTela">regrasFaturamento</div>
  </v-container>
</template>

<style scoped>
.containerInputPrazo {
  display: flex;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid gray;
  width: 36px;
}

.containerInputPrazo input {
  padding: 8px;
  width: 30px;
  text-align: center;
}
</style>
