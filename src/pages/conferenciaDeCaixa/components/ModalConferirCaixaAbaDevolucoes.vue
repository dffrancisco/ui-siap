<script setup lang="ts">
import { computeds, actions, state } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
import { iTiposPagamento } from "../interfaces";
import { reactive } from "vue";

const stateDevolucoes = reactive({
  modalDetalhesPagamentoOpened: false,
  pagamentoSelecionado: <null | iTiposPagamento>null,
  headersDevolucoes: [
    { title: "#", key: "INDEX", width: "10px" },
    { title: "Orçamento", key: "NUM_ORCAMENTO", width: "70px" },
    { title: "Motivo", key: "DESC_DEVOLUCAO" },
    { title: "Pagamentos", key: "PAGAMENTOS" },
    { title: "Total", key: "VALOR", value: (item: any) => utils.formatValor(item.VALOR) },
  ],
});
</script>
<template>
  <v-card
    v-if="computeds.devolucoesPorCaixa.value.length === 0"
    class="pa-3"
    height="410px"
  >
    <v-alert
      type="warning"
      color="primary"
      prominent
      class="mb-4"
    >
      Não há devoluções cadastradas para o caixa selecionado!
    </v-alert>
  </v-card>

  <v-card
    v-else
    class="pa-3"
  >
    <v-row>
      <v-col
        class="d-flex flex-column"
        cols="3"
      >
        <v-card
          class="flex-grow-1"
          height="400px"
          style="overflow-y: scroll"
          outlined
          mandatory
        >
          <v-list-item
            v-for="(item, index) in computeds.totalizadorDevolucaoPorCaixa.value"
            :key="index"
            @click="actions.selecionarPagamentoDevolucao(item.DESCRICAO_PAGAMENTO)"
            :class="{
              tipo_pag_selected: state.pagamentosSelecionadosDevolucao.includes(item.DESCRICAO_PAGAMENTO),
            }"
          >
            <v-list-item-title>{{ item.DESCRICAO_PAGAMENTO }}</v-list-item-title>
            <v-list-item-subtitle>
              <b>{{ utils.formatValor(item.VALOR) }}</b>
            </v-list-item-subtitle>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-data-table-virtual
          :key="state.pagamentoSelecionado"
          :items="computeds.devolucoesPorCaixa.value"
          :headers="stateDevolucoes.headersDevolucoes"
          height="325"
          item-value="id"
          :loading="state.loading"
          fixed-header
          class="elevation-1"
        >
          <template v-slot:item.INDEX="{ item }">
            <span class="text-center font-weight">{{ item.INDEX }}</span>
          </template>

          <template v-slot:item.NUM_ORCAMENTO="{ item }">
            <div class="orcamento-group">
              <div
                :key="item.NUM_ORCAMENTO"
                class="orcamento-box"
                title="Nº Orc. / Valor"
              >
                <div class="orcamento-numero">{{ item.NUM_ORCAMENTO }}</div>
                <div class="orcamento-valor">{{ utils.formatValor(item.VALOR) }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.PAGAMENTOS="{ item }">
            <div class="chips-pagamentos">
              <v-chip
                :key="item.DESCRICAO_PAGAMENTO"
                class="mr-1 chip-pagamento"
                color="#D32F2F"
                title="Devolução"
              >
                <div class="chip-pagamento-descricao">
                  {{ item.DESCRICAO_PAGAMENTO }}
                </div>

                <div class="d-flex align-center">
                  <strong>{{ utils.formatValor(item.VALOR) }}</strong>
                </div>
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

.chips-pagamentos {
  display: flex;
  gap: 4px;
  padding: 6px;
  flex-wrap: wrap;
}

.chip-pagamento {
  width: 120px;
  height: 45px;
  border-radius: 8px !important;
}

.chip-pagamento-descricao {
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 2px;
  padding-right: 8px;
  padding-top: 3px;
}

.orcamento-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px;
  gap: 2px;
}

.orcamento-box {
  display: flex;
  align-items: center;
  border: 1px solid #017bc2c7;
  border-radius: 6px;
  overflow: hidden;
  font-weight: bold;
  color: #0496ea;
  background: rgba(33, 150, 243, 0.15);
  width: fit-content;
}

.orcamento-numero {
  padding: 4px 8px;
  background: #0496ea;
  color: white;
  border-radius: 0px 8px 8px 0px;
  min-width: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orcamento-valor {
  padding: 4px 8px;
  color: #0496ea;
  border-radius: 0 6px 6px 0;
  min-width: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
