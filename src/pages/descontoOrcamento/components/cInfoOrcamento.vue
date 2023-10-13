<script lang="ts" setup>
import { iOrcamento } from "../interfaces";
import { formatValor, dataBrasil } from "@/ts/utils";

const props = defineProps({
  dados: {
    type: Object as () => iOrcamento,
  },
  marcasDesconto: {
    type: Object,
  },
});
</script>

<template>
  <v-card elevation="1" class="mt-n3" style="min-height: 169px">
    <v-card-text>
      <div
        class="text-h5 text--primary text-truncate mb-n2"
        style="min-height: 46px"
      >
        {{ dados.NOME }}
      </div>

      <div class="mt-n3 text-center">
        <v-chip class="ma-2" color="primary" size="small">
          Valor Orçamento <b class="pl-2">{{ formatValor(dados.VALOR) }}</b>
        </v-chip>

        <v-chip class="ma-2" color="secondary" size="small">
          Valor Montagem
          <b class="pl-2"> {{ formatValor(dados.VALOR_MONTAGEN) }}</b>
        </v-chip>
      </div>

      <div class="mt-n3 text-center">
        <v-chip class="ma-2" size="small"
          >Nº Orçamento <b class="pl-2">{{ dados.NUM_ORCAMENTO }}</b>
        </v-chip>
        <v-chip class="ma-2" size="small"
          >Data <b class="pl-2">{{ dataBrasil(dados.DATA) }}</b>
        </v-chip>
      </div>

      <div>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ Object.keys(marcasDesconto).length }}
              - Marcas com Desconto
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-chip
                class="ma-1"
                size="x-small"
                color="cyan"
                label
                v-for="item in marcasDesconto"
                >{{ item.MARCA }} (
                <b class="text-red">{{ item.DESCONTO }}% </b>)
              </v-chip>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.v-expansion-panel-title {
  min-height: 32px;
  padding: 7px 15px;
}
</style>
