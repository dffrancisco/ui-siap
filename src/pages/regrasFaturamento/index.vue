<script lang="ts" setup>
import CardParcelamento from "./components/CardParcelamento.vue";
import InputPrazoDias from "./components/InputPrazoDias.vue";
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
              ></v-text-field>

              <div class="mt-2">
                <span> Prazo (Dias) </span>
                <div class="mt-2 d-flex ga-4">
                  <InputPrazoDias
                    v-for="dia in state.prazoDiasAte"
                    :prazo="dia"
                    @update-prazo="actions.teste"
                  />
                </div>
              </div>
            </div>
          </v-col>

          <v-col>
            <div>
              <v-text-field
                v-mask-decimal.br="2"
                label="Acima De"
              ></v-text-field>

              <div class="mt-2">
                <span> Prazo (Dias) </span>
                <div class="mt-2 d-flex ga-4">
                  <InputPrazoDias
                    v-for="dia in state.prazoDiasDe"
                    :prazo="dia"
                  />
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
          ></v-btn>
        </div>

        <div class="mt-4">
          <CardParcelamento />
        </div>
      </div>
    </v-card>
    <div id="pnCodigoTela">regrasFaturamento</div>
  </v-container>
</template>
