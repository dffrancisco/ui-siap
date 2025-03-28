<script setup lang="ts">
import { computeds, actions, state } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
</script>

<template>
  <v-card
    class="pa-3"
    height="400px"
    v-if="computeds.observacoesPorCaixa.value.length === 0"
  >
    <v-alert
      type="warning"
      color="primary"
      prominent
      class="mb-4"
    >
      Não há observações cadastradas para o caixa selecionado!
    </v-alert>
  </v-card>

  <v-card
    v-else
    class="pa-3"
    height="400px"
  >
    <v-row class="h-100">
      <v-col
        cols="2"
        class="d-flex mt-2"
      >
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          class="w-100"
          height="30px"
          title="Adicionar Observação"
        >
          Incluir
        </v-btn>
      </v-col>

      <v-col
        cols="10"
        class="overflow-auto mt-2"
        style="max-height: 370px"
      >
        <v-row>
          <v-col
            v-for="(observacao, index) in computeds.observacoesPorCaixa.value.filter((obs) => obs[0])"
            :key="index"
            cols="12"
          >
            <v-card
              class="pa-3 d-flex align-center"
              elevation="2"
              rounded="lg"
            >
              <v-col cols="1">
                <v-avatar size="35px">
                  <v-img
                    :src="actions.getFotoFuncionarioURL(state.caixaSelected.CPF)"
                    cover
                    :title="state.caixaSelected.LOGIN"
                  ></v-img> </v-avatar
              ></v-col>

              <v-col cols="8">
                <div class="font-weight-bold">
                  {{ observacao[0] }}
                </div>
              </v-col>

              <v-col cols="3"
                ><div class="text-right text-caption font-weight-bold">
                  {{ utils.dataBrasil(state.caixaSelected.DATA_ABERTURA) }}
                </div></v-col
              >
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
