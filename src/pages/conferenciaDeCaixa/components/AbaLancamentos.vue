<script setup lang="ts">
import { state, actions, computeds } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
import IconPagamento from "./IconPagamento.vue";
import VChipOrcamento from "./VChipOrcamentos.vue";
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
      <v-col
        cols="9"
        style="padding-left: 0"
      >
        <v-data-table-virtual
          :key="state.pagamentoSelecionado"
          :items="computeds.comprasFiltradas.value"
          :headers="state.headersLancamentos"
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
            <VChipOrcamento
              :orcamentos="
                item.ORCAMENTOS?.length
                  ? item.ORCAMENTOS
                  : [{ NUM_ORCAMENTO: item.NUM_ORCAMENTO, VALOR_ORCAMENTO: item.VALOR_ORCAMENTO }]
              "
              :entregarReceber="item.ENTREGAR_RECEBER"
            />
          </template>

          <template v-slot:item.PAGAMENTOS="{ item }">
            <div class="chips-pagamentos">
              <v-chip
                v-for="pagamento in item.TIPOS_PAGAMENTO"
                :key="pagamento.TIPOS_PAGAMENTO"
                class="mr-1 chip-pagamento"
                color="primary"
                @click.stop="exibirDetalhesPagamento(pagamento)"
                title="ver detalhes"
              >
                <div class="chip-pagamento-icon">
                  <IconPagamento
                    :tipoPagamento="pagamento.DESCRICAO_PAGAMENTO"
                    :bandeira="pagamento.BANDEIRA"
                    :descricaoBandeira="pagamento.DESCRICAO_BANDEIRA"
                  />
                  <div class="d-flex flex-column">
                    <div class="d-flex align-center justify-space-between">
                      <div class="chip-pagamento-descricao">
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
  <v-dialog v-model="stateLancamentos.modalDetalhesPagamentoOpened">
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

.chips-pagamentos {
  display: flex;
  gap: 4px;
  padding: 4px;
  flex-wrap: wrap;
  margin-left: -20px;
  max-width: 100%;
}

.v-icon {
  cursor: pointer;
}

.chip-pagamento {
  max-width: 100px;
  height: 45px;
  border-radius: 8px !important;
}

.chip-pagamento-icon {
  width: 105px;
  display: flex;
}

.chip-pagamento-descricao {
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 2px;
}
</style>
