<script setup lang="ts">
import { state, totalDevolucoes } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
</script>

<template>
  <v-card class="pa-3">
    <v-row>
      <!--Totalizador Devoluções-->
      <v-col cols="4">
        <v-card
          class="pa-2"
          max-height="325px"
          style="overflow-y: scroll"
        >
          <v-list dense>
            <v-list-subheader><u>Totalizador Devoluções</u></v-list-subheader>
            <v-list-item
              v-for="(total, caixa) in totalDevolucoes.totaisPorCaixa"
              :key="caixa"
            >
              <v-list-item-title>
                {{ caixa }}: <strong>{{ utils.formatValor(total) }}</strong>
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider class="my-2"></v-divider>

          <v-list-item>
            <v-list-item-title>
              <strong>Total Geral:</strong> {{ utils.formatValor(totalDevolucoes.totalGeral) }}
            </v-list-item-title>
          </v-list-item>
        </v-card>
      </v-col>

      <!-- Tabela de Devoluções -->
      <v-col cols="8">
        <v-data-table-virtual
          :items="state.devolucoes"
          height="325"
          :headers="[
            { title: 'Caixa', key: 'CAIXA' },
            { title: 'Valor', key: 'VALOR', value: (item) => utils.formatValor(item.VALOR) },
            // { title: 'Orçamento', key: 'NUM_ORCAMENTO' },
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
