<script setup lang="ts">
import { state, actions, comprasFiltradas } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
import IconPagamento from "./IconPagamento.vue";
import { iTiposPagamento } from "../interfaces";
import { reactive } from "vue";
import ModalDetalhesPagamento from "./ModalDetalhesPagamento.vue";

const exibirDetalhesPagamento = (pagamento: iTiposPagamento) => {
  stateLancamentos.pagamentoSelecionado = pagamento;
  stateLancamentos.modalDetalhesPagamentoOpened = true;
};

const stateLancamentos = reactive({
  modalDetalhesPagamentoOpened: false,
  pagamentoSelecionado: <null | iTiposPagamento>null,
});
</script>

<template>
  <v-card class="pa-3">
    <v-row>
      <!-- Totalizadores Valores Recebidos -->
      <v-col cols="3">
        <v-card
          max-height="325px"
          style="overflow-y: scroll"
          outlined
        >
          <v-list>
            <template v-if="state.totalizadores.length > 0">
              <v-list-item
                v-for="(item, index) in state.totalizadores"
                :key="index"
                @click="actions.selecionarPagamento(item.TIPO_PAGAMENTO)"
                :class="{ tipo_pag_selected: item.TIPO_PAGAMENTO === state.pagamentoSelecionado }"
              >
                <v-list-item-title>{{ item.DESCRICAO_PAGAMENTO }}</v-list-item-title>
                <v-list-item-subtitle>
                  <b>{{ utils.formatValor(item.VALOR) }}</b>
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <template v-else>
              <span class="text-center d-block mt-3 text-grey">Não há lançamentos nesta data</span>
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Card Direito (Compras do Tipo Selecionado) -->
      <v-col cols="9">
        <v-data-table-virtual
          :items="comprasFiltradas"
          :headers="state.headersLancamentos"
          height="325"
          item-value="id"
          :loading="state.loading"
          fixed-header
          class="elevation-1"
        >
          <template v-slot:item.INDEX="{ item }">
            <span
              class="text-center font-weight"
              style="max-width: 40px"
              >{{ item.INDEX }}</span
            >
          </template>

          <template v-slot:item.NUM_ORCAMENTO="{ item }">
            <div class="orcamento-group">
              <div
                v-for="orc in item.ORCAMENTOS?.length
                  ? item.ORCAMENTOS
                  : [{ NUM_ORCAMENTO: item.NUM_ORCAMENTO, VALOR_ORCAMENTO: item.VALOR_ORCAMENTO }]"
                :key="orc.NUM_ORCAMENTO"
                class="orcamento-box"
                :class="{ 'orcamento-entregar-receber': item.ENTREGAR_RECEBER == true }"
                :title="item.ENTREGAR_RECEBER == true ? 'E/R Dias Anteriores' : 'Nº Orc. / Valor'"
              >
                <div
                  class="orcamento-numero"
                  :class="{ 'orcamento-numero-entregar-receber': item.ENTREGAR_RECEBER == true }"
                  >{{ orc.NUM_ORCAMENTO }}</div
                >
                <div
                  class="orcamento-valor"
                  :class="{ 'orcamento-valor-entregar-receber': item.ENTREGAR_RECEBER == true }"
                  >{{ utils.formatValor(orc.VALOR_ORCAMENTO) }}</div
                >
              </div>
            </div>
          </template>

          <template v-slot:item.PAGAMENTOS="{ item }">
            <div class="d-flex flex-wrap pa-1">
              <v-chip
                v-for="pagamento in item.TIPOS_PAGAMENTO"
                :key="pagamento.TIPOS_PAGAMENTO"
                class="mr-1 chip-custom"
                color="primary"
                @click.stop="exibirDetalhesPagamento(pagamento)"
                title="ver detalhes"
              >
                <div class="chip-content">
                  <IconPagamento
                    :tipoPagamento="pagamento.DESCRICAO_PAGAMENTO"
                    :bandeira="pagamento.BANDEIRA"
                    :descricaoBandeira="pagamento.DESCRICAO_BANDEIRA"
                  />
                  <div class="d-flex flex-column">
                    <div class="d-flex align-center justify-space-between">
                      <div class="descricao-pagamento">
                        {{ pagamento.DESCRICAO_PAGAMENTO }}
                        <span v-if="pagamento.DIVIDE !== null"> {{ pagamento.DIVIDE }}x </span>
                      </div>
                    </div>

                    <div class="d-flex align-center">
                      <strong>{{ utils.formatValor(pagamento.VALOR) }}</strong>
                    </div>
                  </div>
                </div>
              </v-chip>
            </div>
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-card>

  <!-- Modal Detalhes Pagamento -->
  <v-dialog
    v-model="stateLancamentos.modalDetalhesPagamentoOpened"
    max-width="500"
  >
    <ModalDetalhesPagamento
      :modalOpened="stateLancamentos.modalDetalhesPagamentoOpened"
      :pagamentoSelecionado="stateLancamentos.pagamentoSelecionado"
      @closeModalDetalhesPagamento="stateLancamentos.modalDetalhesPagamentoOpened = false"
    />
  </v-dialog>
</template>

<style scoped>
.tipo_pag_selected {
  background-color: #017bc2c7 !important;
  color: white !important;
  border-radius: 8px;
}

.v-chip {
  display: flex;
  align-items: center;
  height: 50px;
}

.v-icon {
  cursor: pointer;
}

.chip-custom {
  width: 105px;
  height: 45px;
  border-radius: 8px !important;
}

.chip-content {
  width: 105px;
  display: flex;
}

.descricao-pagamento {
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 2px;
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

.orcamento-numero-entregar-receber {
  padding: 4px 8px;
  background: #c2016575;
  color: white;
  border-radius: 0px 8px 8px 0px;
}

.orcamento-valor-entregar-receber {
  padding: 4px 8px;
  color: #c20165c1;
  border-radius: 0 6px 6px 0;
}

.orcamento-entregar-receber {
  display: flex;
  align-items: center;
  border: 1px solid #c20165c7;
  border-radius: 6px;
  overflow: hidden;
  font-weight: bold;
  color: #fb2be7;
  background: rgba(243, 33, 229, 0.15);
  width: fit-content;
  margin-top: 3px;
  margin-bottom: 3px;
  margin-right: 5px;
}
</style>
