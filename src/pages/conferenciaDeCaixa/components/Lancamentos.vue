<script setup lang="ts">
import { state, actions, comprasFiltradas } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
</script>

<template>
  <v-card class="pa-3">
    <v-row>
      <!-- Card Esquerdo (Totalizadores) -->
      <v-col cols="4">
        <v-card
          max-height="350px"
          style="overflow-y: scroll"
          outlined
        >
          <v-list>
            <v-list-item
              v-for="(item, index) in state.valoresRecebidos"
              :key="index"
              @click="actions.selecionarPagamento(item.TIPO_PAGAMENTO)"
              :class="{ tipo_pag_selected: item.TIPO_PAGAMENTO === state.pagamentoSelecionado }"
            >
              <v-list-item-title>{{ item.DESCRICAO_PAGAMENTO }}</v-list-item-title>
              <v-list-item-subtitle>
                <b>{{ utils.formatValor(item.VALOR) }}</b>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Card Direito (Compras do Tipo Selecionado) -->
      <v-col cols="8">
        <v-data-table-virtual
          :items="comprasFiltradas"
          :headers="state.headers"
          height="350"
          item-value="id"
          :loading="state.loading"
          fixed-header
          class="elevation-1"
        >
          <template v-slot:item.NUM_ORCAMENTO="{ item }">
            <div class="d-flex flex-wrap align-center">
              <div
                v-for="orc in item.DADOS_ORCAMENTO?.length
                  ? item.DADOS_ORCAMENTO
                  : [{ NUM: item.NUM_ORCAMENTO, VL: item.VALOR }]"
                :key="orc.NUM"
                class="d-flex align-center mr-2"
              >
                <v-chip
                  class="mr-1"
                  color="primary"
                  style="border-radius: 8px !important"
                >
                  {{ orc.NUM }}
                </v-chip>
                <v-chip
                  class="mr-1"
                  style="border-radius: 8px !important"
                >
                  {{ utils.formatValor(orc.VL) }}
                </v-chip>
              </div>
            </div>
          </template>

          <template v-slot:item.PAGAMENTOS="{ item }">
            <div class="d-flex flex-wrap">
              <v-chip
                v-for="pagamento in item.TP"
                :key="pagamento.TIPO_PAGAMENTO"
                class="mr-1"
                color="primary"
              >
                {{ pagamento.DESCRICAO_PAGAMENTO }}: {{ utils.formatValor(pagamento.VALOR) }}
              </v-chip>
            </div>
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.tipo_pag_selected {
  background-color: #017bc2c7 !important;
  color: white !important;
  border-radius: 8px;
}
</style>
