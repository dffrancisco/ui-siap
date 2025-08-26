<script setup lang="ts">
import { actions, state, computeds } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
</script>
<template>
  <v-card
    class="pa-3 h-100"
    v-if="computeds.sangriasPorCaixa.value.length === 0"
  >
    <v-alert
      type="warning"
      color="primary"
      prominent
      class="mb-4"
    >
      Não há sangrias cadastradas para o caixa selecionado!
    </v-alert>
  </v-card>

  <v-card
    v-else
    class="pa-3"
    height="400px"
  >
    <v-row>
      <v-col class="text-h6 font-weight-bold">
        Total: {{ utils.formatValor(computeds.totalSangriasPorCaixa.value) }}
      </v-col>
    </v-row>

    <v-row class="overflow-auto">
      <v-col
        v-for="(sangria, index) in computeds.sangriasPorCaixa.value"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="pa-2 d-flex align-center"
          elevation="2"
          color="#C8E6C9"
          rounded="lg"
        >
          <v-col
            cols="3"
            class="text-left"
          >
            <div class="text-caption font-weight-bold">
              <v-avatar size="40px">
                <v-img
                  :src="actions.getFotoFuncionarioURL(state.caixaSelected.CPF)"
                  cover
                  :title="state.caixaSelected.LOGIN"
                ></v-img>
              </v-avatar>
            </div>
          </v-col>

          <v-col
            cols="6"
            class="text-left"
          >
            <div class="text font-weight-bold">
              {{ utils.formatValor(sangria.VALOR) }}
            </div>
            <div class="text-caption">
              Entregue para: <b>{{ sangria.ENTREGUE_PARA }}</b>
            </div>
          </v-col>
          <v-col
            cols="3"
            class="text-right"
          >
            {{ utils.formatHora(sangria.HORA) }}
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
