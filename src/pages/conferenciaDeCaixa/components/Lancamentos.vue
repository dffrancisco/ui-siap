<script setup lang="ts">
import { state, actions, comprasFiltradas } from "../conferenciaDeCaixa";
import utils from "@/ts/utils";
import IconPagamento from "./IconPagamento.vue";

const exibirDetalhesPagamento = (pagamento: any) => {
  console.log("Detalhes do pagamento:", pagamento);
};
</script>

<template>
  <v-card class="pa-3">
    <v-row>
      <!-- Card Esquerdo (Totalizadores) -->
      <v-col cols="3">
        <v-card
          max-height="355px"
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
      <v-col cols="9">
        <v-data-table-virtual
          :items="comprasFiltradas"
          :headers="state.headers"
          height="352"
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
                class="orcamento-box"
              >
                <div class="orcamento-numero">{{ orc.NUM }}</div>
                <div class="orcamento-valor">{{ utils.formatValor(orc.VL) }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.PAGAMENTOS="{ item }">
            <div class="d-flex flex-wrap">
              <v-chip
                v-for="pagamento in item.TP"
                :key="pagamento.TIPO_PAGAMENTO"
                class="mr-1 chip-custom"
                color="primary"
                style="border-radius: 8px !important; margin: 3px"
              >
                <div class="chip-content">
                  <!-- Descrição do pagamento acima -->
                  <div class="descricao-pagamento">
                    {{ pagamento.DESCRICAO_PAGAMENTO }}
                    <span v-if="pagamento.DIVIDE !== null"> {{ pagamento.DIVIDE }}x </span>
                  </div>

                  <div class="d-flex align-center">
                    <!-- Ícone do tipo de pagamento -->
                    <IconPagamento
                      :tipoPagamento="pagamento.DESCRICAO_PAGAMENTO"
                      :bandeira="pagamento.BANDEIRA"
                      :descricaoBandeira="pagamento.DESCRICAO_BANDEIRA"
                    />

                    <!-- Valor do pagamento -->
                    {{ utils.formatValor(pagamento.VALOR) }}

                    <!-- Ícone de informação -->
                    <v-icon
                      class="ml-1"
                      @click.stop="exibirDetalhesPagamento(pagamento)"
                    >
                      mdi-information
                    </v-icon>
                  </div>
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

.v-chip {
  display: flex;
  align-items: center;
  height: 50px;
}

.v-icon {
  cursor: pointer;
}

.chip-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
}

.descricao-pagamento {
  font-size: 9px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 2px;
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
  margin-top: 3px;
  margin-bottom: 3px;
  margin-right: 5px;
}

.orcamento-numero {
  padding: 4px 8px;
  background: #0496ea;
  color: white;
  border-radius: 0px 8px 8px 0px;
}

.orcamento-valor {
  padding: 4px 8px;
  color: #0496ea;
  border-radius: 0 6px 6px 0;
}
</style>
