<script setup lang="ts">
import { state, computeds } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
</script>

<template>
  <v-card class="pa-1">
    <v-row>
      <!-- Totalizador Sangrias-->
      <v-col cols="4">
        <v-card
          max-height="340px"
          style="overflow-y: scroll"
        >
          <v-list dense>
            <v-list-subheader><u>Totalizador Sangrias</u></v-list-subheader>
            <v-list-item
              v-for="(total, pessoa) in computeds.totalSangrias.value.totaisPorPessoa"
              :key="pessoa"
            >
              <v-list-item-title>
                {{ pessoa }}: <strong>{{ utils.formatValor(total) }}</strong>
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-title>
              <strong>Total Geral:</strong>
              {{ utils.formatValor(computeds.totalSangrias.value.totalGeral) }}
            </v-list-item-title>
          </v-list-item>
        </v-card>
      </v-col>

      <!-- Tabela de Sangrias -->
      <v-col cols="8">
        <v-data-table-virtual
          :items="state.sangrias"
          height="340"
          :headers="[
            { title: 'Valor', key: 'VALOR', value: (item) => utils.formatValor(item.VALOR) },
            { title: 'Hora', key: 'HORA', value: (item) => utils.formatHora(item.HORA) },
            { title: 'Caixa', key: 'LOGIN' },
            { title: 'Entregue Para', key: 'ENTREGUE_PARA' },
          ]"
          item-value="HORA"
          density="compact"
          class="elevation-1"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
