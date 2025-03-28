<script setup lang="ts">
import { state, computeds } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
</script>

<template>
  <v-card class="pa-1">
    <v-row>
      <!--Totalizador Devoluções-->
      <v-col cols="4">
        <v-card
          max-height="340px"
          style="overflow-y: scroll"
        >
          <v-list dense>
            <v-list-subheader><u>Totalizador Devoluções</u></v-list-subheader>
            <v-list-item
              v-for="(total, caixa) in computeds.totalDevolucoes.value.totaisPorCaixa"
              :key="caixa"
            >
              <v-list-item-title>
                {{ caixa }}: <strong>{{ utils.formatValor(total) }}</strong>
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-title>
              <strong>Total Geral:</strong> {{ utils.formatValor(computeds.totalDevolucoes.value.totalGeral) }}
            </v-list-item-title>
          </v-list-item>
        </v-card>
      </v-col>

      <!-- Tabela de Devoluções -->
      <v-col cols="8">
        <v-data-table-virtual
          :items="state.devolucoes"
          height="340"
          :headers="[
            { title: 'Caixa', key: 'CAIXA' },
            { title: 'Valor', key: 'VALOR', value: (item) => utils.formatValor(item.VALOR) },
            { title: 'Tipo Pagto', key: 'DESCRICAO_PAGAMENTO' },
            { title: 'Código', key: 'CODIGO' },
            { title: 'Autor', key: 'LOGIN' },
          ]"
          item-value="NUM_ORCAMENTO"
          density="compact"
          class="elevation-1"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
