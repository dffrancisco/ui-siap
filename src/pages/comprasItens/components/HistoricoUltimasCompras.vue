<script setup lang="ts">
import { reactive } from "vue";
import { iUltimaCompra, iTipoVisualizacao } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps({
  ultimasCompras: {
    type: Array as () => iUltimaCompra[],
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
  <div class="historico-ultima-compra">
    <div class="historico-ultima-compra-cabecalho">
      <div>
        <strong>{{ state.tipoVisualizacao == "unica" ? "Última Compra" : "Últimas Compras" }} </strong>
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
      class="historico-ultima-compra-dados"
    >
      <div class="d-flex justify-space-between">
        <div>
          <span class="mr-1">Data:</span>
          <strong>{{ utils.dataBrasil(ultimasCompras[0].DATA) }}</strong>
        </div>
        <div>
          <span class="mr-1">Qtd:</span>
          <strong>{{ ultimasCompras[0].QTD }}</strong>
        </div>
      </div>
      <div class="d-flex justify-space-between">
        <div>
          <span class="mr-1">Custo:</span>
          <strong>{{ utils.formatValor(ultimasCompras[0].CUSTO) }}</strong>
        </div>
        <div>
          <span class="mr-1">Venda:</span>
          <strong>{{ utils.formatValor(ultimasCompras[0].VENDA) }}</strong>
        </div>
      </div>
      <div>
        <div>
          <span class="mr-1">Fornecedor:</span>
          <strong>{{ ultimasCompras[0].FORNECEDOR }}</strong>
        </div>
      </div>
    </div>
    <div
      v-if="state.tipoVisualizacao == 'lista'"
      class="historico-ultima-compra-lista"
    >
      <div
        class="historico-ultima-compra-lista-card"
        v-for="compra in ultimasCompras"
      >
        <div class="text-truncate">
          <span>{{ compra.FORNECEDOR }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>NF {{ compra.NUM_NOTA }}</span>
          <span>{{ utils.dataBrasil(compra.DATA) }}</span>
          <span>C: {{ utils.formatValor(compra.CUSTO) }}</span>
          <span>V: {{ utils.formatValor(compra.VENDA) }}</span>
        </div>
        <div
          class="historico-ultima-compra-lista-card-qtd"
          :class="{ 'historico-ultima-compra-lista-card-qtd-orange': compra.MESMO_GRUPO == 1 ? true : false }"
        >
          {{ compra.QTD }}
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
.historico-ultima-compra {
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

.historico-ultima-compra-cabecalho {
  display: flex;
  justify-content: space-between;
}

.historico-ultima-compra-dados {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;

  strong {
    font-size: 16px;
  }
}

.historico-ultima-compra-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 4px;
}

.historico-ultima-compra-lista-card {
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

.historico-ultima-compra-lista-card-qtd {
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

.historico-ultima-compra-lista-card-qtd-orange {
  background-color: var(--warning-300);
}
</style>
