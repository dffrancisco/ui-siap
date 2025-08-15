<script setup lang="ts">
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import { actions, state } from "./trocarVendedor";
import { formatValor } from "@/ts/utils";

actions.init();
</script>

<template>
  <v-app id="card">
    <v-container class="d-flex justify-center align-center">
      <v-card
        color="blue-grey-lighten-4 mt-15"
        max-width="900"
        style="width: 100%"
      >
        <v-card class="cardePincipal pb-5 cmx-auto pa-3">
          <v-col
            cols="12"
            sm="6"
            md="5"
            class="d-flex mt-5"
          >
            <v-text-field
              class="px-2"
              label="N° Orçamento"
              variant="outlined"
              density="compact"
              :hide-details="true"
              v-model="state.numOrcamento"
              @keypress.enter.stop="actions.getOrcamento"
            />

            <v-btn
              icon="mdi-magnify"
              color="primary"
              size="small"
              @click.prevent="actions.getOrcamento"
            ></v-btn>
          </v-col>
          <v-col
            cols="12"
            md="12"
            class="d-flex"
          >
            <v-col
              cols="12"
              md="6"
            >
              <v-card
                max-width="450"
                border
                flat
              >
                <v-col><strong> Dados do Orçamento</strong> </v-col>
                <div class="d-flex">
                  <v-col>
                    <v-col
                      ><span> N° Orçamento: {{ state.orcamento.NUM_ORCAMENTO }}</span></v-col
                    >
                    <v-col
                      ><span> Valor Orçamento: {{ formatValor(state.orcamento.VALOR) }}</span></v-col
                    >
                  </v-col>
                  <v-col>
                    <v-col
                      ><span>
                        Data:
                        {{
                          state.orcamento.DATA ? new Date(state.orcamento.DATA).toLocaleDateString("pt-BR") : ""
                        }}</span
                      ></v-col
                    >
                  </v-col>
                </div>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-avatar
                      size="42px"
                      color="grey"
                      class="mr-2"
                    >
                      <v-img
                        :src="`https://www.reallatas.com.br/foto_funcionarios/${state.orcamento.CPF}.jpg`"
                        aspect-ratio="1"
                        cover
                      />
                    </v-avatar>
                    <v-text-field
                      hide-details
                      disabled
                      :value="state.orcamento.NOME_COMP"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  class="d-flex justify-center"
                >
                  <v-icon>mdi mdi-swap-horizontal-bold</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-avatar
                      size="42px"
                      color="grey"
                      class="mr-2"
                    >
                      <v-img
                        :src="`http://www.reallatas.com.br/foto_funcionarios/${state.novoVendedor.CPF}.jpg`"
                        aspect-ratio="1"
                        cover
                      />
                    </v-avatar>

                    <v-select
                      hide-details
                      variant="outlined"
                      density="compact"
                      :items="state.vendedores"
                      item-value="COD_FUNCIONARIO"
                      item-title="NOME_COMP"
                      v-model="state.novoVendedor"
                      return-object
                      :disabled="!state.orcamento.NUM_ORCAMENTO"
                    ></v-select>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col class="d-flex justify-end pr-10">
            <v-row>
              <v-col
                cols="12"
                class="d-flex justify-end"
              >
                <v-btn
                  @click="actions.onClickTrocar"
                  color="primary"
                  :disabled="!state.orcamento.NUM_ORCAMENTO"
                >
                  Trocar
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-card>
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
      <modalXAuthManager />
    </v-container>
  </v-app>
</template>

<style scoped></style>
