<script setup lang="ts">
import { sangriasPorCaixa, actions, state, totalSangriasPorCaixa } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
</script>
<template>
  <v-card
    class="pa-3"
    height="400px"
  >
    <v-row>
      <v-col class="text-h6 font-weight-bold"> Total: {{ utils.formatValor(totalSangriasPorCaixa) }} </v-col>
    </v-row>

    <v-row class="overflow-auto">
      <v-col
        v-for="(sangria, index) in sangriasPorCaixa"
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
