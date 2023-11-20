<script setup lang="ts">
import { onMounted } from "vue";
import {
  init,
  state,
  urlAvatarNovoMontador,
  urlAvatarMontador,
  getOrcamento,
  onClickTrocar,
} from "./trocarMontador";

import { dataBrasil, formatValor } from "@/ts/utils";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";

onMounted(async () => {
  await init();
});
</script>

<template>
  <v-main>
    <v-container>
      <v-card max-width="1000" class="mx-auto pa-3">
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                type="number"
                hide-details
                label="Nº Orçamento"
                v-model="state.numOrcamento"
                @keypress.enter="getOrcamento"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn @click="getOrcamento" icon color="primary" size="small">
                <v-icon>mdi mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <div class="dados_orcamento">
                <strong>Dados do Orçamento</strong>
                <v-row class="mt-1">
                  <v-col cols="6">
                    <span>Nº Orçamento:</span>
                    <strong class="ml-2">{{
                      state.orcamento.NUM_ORCAMENTO
                    }}</strong>
                  </v-col>
                  <v-col cols="6">
                    <span>Data:</span>
                    <strong class="ml-2">
                      {{ dataBrasil(state.orcamento.DATA) }}
                    </strong>
                  </v-col>
                  <v-col cols="6">
                    <span>Valor Orçamento:</span>
                    <strong class="ml-2">
                      {{ formatValor(state.orcamento.VALOR) }}
                    </strong>
                  </v-col>
                  <v-col cols="6">
                    <span>Valor Montagem:</span>
                    <strong class="ml-2">
                      {{ formatValor(state.orcamento.VALOR_MONTAGEM) }}
                    </strong>
                  </v-col>
                  <v-col cols="6">
                    <span>Montador:</span>
                    <strong class="ml-2">
                      {{ state.orcamento.NOME_MONTADOR }}
                    </strong>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-avatar size="42px" color="grey" class="mr-2">
                      <v-img :src="urlAvatarMontador" aspect-ratio="1" cover />
                    </v-avatar>
                    <v-text-field
                      hide-details
                      disabled
                      :value="state.orcamento.NOME_MONTADOR"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="d-flex justify-center">
                  <v-icon>mdi mdi-swap-horizontal-bold</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-avatar size="42px" color="grey" class="mr-2">
                      <v-img
                        :src="urlAvatarNovoMontador"
                        aspect-ratio="1"
                        cover
                      />
                    </v-avatar>
                    <v-select
                      hide-details
                      variant="outlined"
                      density="compact"
                      :items="state.montadores"
                      item-value="COD_FUNCIONARIO"
                      item-title="NOME_MONTADOR"
                      v-model="state.novoMontador"
                      return-object
                      :disabled="!state.orcamento.NUM_ORCAMENTO"
                    ></v-select>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                @click="onClickTrocar"
                color="primary"
                :disabled="!state.orcamento.NUM_ORCAMENTO"
              >
                Trocar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
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
  </v-main>
</template>

<style lang="scss" scoped>
.dados_orcamento {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 8px 16px;
}

.montagem {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 8px 16px;
}
</style>
