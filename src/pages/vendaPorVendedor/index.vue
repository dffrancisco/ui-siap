<script setup lang="ts">
import moment from "moment";
import { state, actions, vendasOrdenadas, dadosToPrint } from "./vendaPorVendedor";
import printJS from "print-js";
</script>

<template>
  <v-container>
    <v-card class="pa-5 cardContainer">
      <div class="inputs pb-5">
        <div class="inputData">
          <span>Data Inicial</span>
          <input
            v-model="state.dataInicial"
            type="date"
            class="ss obr"
            :max="moment().format('YYYY-MM-DD')"
          />
        </div>
        <div class="inputData">
          <span>Data Final</span>
          <input
            v-model="state.dataFinal"
            type="date"
            class="ss obr"
            :max="moment().format('YYYY-MM-DD')"
          />
        </div>
        <div>
          <v-btn
            color="primary"
            icon="mdi-magnify mdi-24px"
            size="40"
            @click="actions.searchVendasBtn"
          >
          </v-btn>
        </div>
        <div>
          <v-btn
            color="primary"
            icon="mdi-printer mdi-24px"
            size="40"
            @click="
              printJS({
                printable: dadosToPrint,
                properties: [
                  { field: 'LOGIN', displayName: 'Vendedor' },
                  { field: 'LIMITE', displayName: 'Limite Crédito' },
                  { field: 'VALOR_VENDA', displayName: 'Venda' },
                  { field: 'VALOR_DEVOLUCAO', displayName: 'Devolução' },
                  { field: 'VENDA_LIQUIDA', displayName: 'Ved.Líquida' },
                  { field: 'TICKET_MEDIO', displayName: 'Ticket Médio' },
                  { field: 'QTD_MEDIA_ITENS', displayName: 'Qtd.Média Itens' },
                ],
                type: 'json',
                gridHeaderStyle: 'border: 1px solid #000000',
                gridStyle: 'text-align: center; border: 1px solid #000000',
              })
            "
          >
          </v-btn>
        </div>
      </div>

      <v-data-table
        :headers="state.headers"
        :items="vendasOrdenadas"
        style="text-transform: none"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        class="ss"
        height="570"
      >
        <template v-slot:item.VALOR_DEVOLUCAO="{ value }">
          <spam style="color: #bf3f3f"> -{{ value }} </spam>
        </template>
        <template v-slot:item.inf="{ item }">
          <v-icon
            v-if="item.COD_FUNCIONARIO != null"
            size="large"
            color="primary"
            @click="console.log('abrir modal')"
          >
            mdi-information
          </v-icon>
        </template>
      </v-data-table>

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
    </v-card>
  </v-container>
</template>

<style scoped>
.inputs {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 26px;
}

.inputData {
  width: 140px;
}

.cardContainer {
  width: 900px;
  margin: 0 auto;
}
</style>
