<script setup lang="ts">
import { reactive } from "vue";
import { iUltimaVenda, iTipoVisualizacao } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps({
  ultimasVendas: {
    type: Array as () => iUltimaVenda[],
    default: [],
  },
});

const state = reactive({
  tipoVisualizacao: <iTipoVisualizacao>"unica",
});

const actions = {
  setTipoVisualizacao: (tipoVisualizacao: iTipoVisualizacao) => {
    state.tipoVisualizacao = tipoVisualizacao;
  },
};
</script>

<template>
  <div class="historico-ultima-venda">
    <div class="historico-ultima-venda-cabecalho">
      <div>
        <strong>{{ state.tipoVisualizacao == "unica" ? "Última Venda" : "Últimas Vendas" }} </strong>
      </div>
      <div>
        <v-icon
          v-if="state.tipoVisualizacao == 'unica'"
          title="visualização lista"
          @click="actions.setTipoVisualizacao('lista')"
          >mdi mdi-menu</v-icon
        >
        <v-icon
          v-if="state.tipoVisualizacao == 'lista'"
          title="visualização única"
          @click="actions.setTipoVisualizacao('unica')"
          >mdi mdi-id-card</v-icon
        >
      </div>
    </div>
    <div
      v-if="state.tipoVisualizacao == 'unica'"
      class="historico-ultima-venda-dados"
    >
      <div class="d-flex justify-space-between">
        <div>
          <span class="mr-1">Data:</span>
          <strong>{{ utils.dataBrasil(ultimasVendas[0].DATA) }}</strong>
        </div>
        <div>
          <span class="mr-1">Qtd:</span>
          <strong>{{ ultimasVendas[0].QTD }}</strong>
        </div>
      </div>
      <div class="d-flex justify-space-between">
        <div>
          <span class="mr-1">Vendedor:</span>
          <strong>{{ ultimasVendas[0].VENDEDOR }}</strong>
        </div>
        <div>
          <span class="mr-1">Valor:</span>
          <strong>{{ utils.formatValor(ultimasVendas[0].VALOR) }}</strong>
        </div>
      </div>
      <div>
        <div>
          <span class="mr-1">Cliente:</span>
          <strong>{{ ultimasVendas[0].CLIENTE }}</strong>
        </div>
      </div>
    </div>
    <div
      v-if="state.tipoVisualizacao == 'lista'"
      class="historico-ultima-venda-lista"
    >
      <div
        class="historico-ultima-venda-lista-card"
        v-for="venda in ultimasVendas"
      >
        <div class="text-truncate">
          <span>{{ venda.CLIENTE }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>OR {{ venda.NUM_ORCAMENTO }}</span>
          <span>{{ utils.dataBrasil(venda.DATA) }}</span>
          <span>{{ utils.formatValor(venda.VALOR) }}</span>
          <span>{{ venda.VENDEDOR }}</span>
        </div>
        <div
          class="historico-ultima-venda-lista-card-qtd"
          :class="{ 'historico-ultima-venda-lista-card-qtd-orange': venda.MESMO_GRUPO == 1 ? true : false }"
        >
          {{ venda.QTD }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
}
::-webkit-scrollbar-track-piece {
  background-color: #000;
}
::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #666;
  border-radius: 3px;
}
</style>

<style lang="scss" scoped>
.historico-ultima-venda {
  width: 100%;
  padding: 12px;
  background-color: var(--grey-900);
  display: flex;
  gap: 8px;
  flex-direction: column;
  border-radius: 8px;
  margin-top: 12px;
  height: 175px;
}

.historico-ultima-venda-cabecalho {
  display: flex;
  justify-content: space-between;
}

.historico-ultima-venda-dados {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;

  strong {
    font-size: 16px;
  }
}

.historico-ultima-venda-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 4px;
}

.historico-ultima-venda-lista-card {
  padding: 2px 12px;
  display: flex;
  flex-direction: column;
  background-color: var(--grey-800);
  line-height: 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 900;
  position: relative;
}

.historico-ultima-venda-lista-card-qtd {
  position: absolute;
  right: 0;
  top: 0;
  background-color: var(--primary-300);
  color: var(--grey-800);
  width: 26px;
  height: 12px;
  font-size: 10px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom-left-radius: 24px;
  border-top-right-radius: 4px;
  padding-right: 4px;
}

.historico-ultima-venda-lista-card-qtd-orange {
  background-color: var(--warning-300);
}
</style>
