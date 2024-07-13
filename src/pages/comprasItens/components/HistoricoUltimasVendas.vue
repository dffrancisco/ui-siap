<script setup lang="ts">
import { reactive } from "vue";
import Skeleton from "@/components/Skeleton.vue";
import { iUltimaVenda, iTipoVisualizacao } from "../interfaces";
import utils from "@/ts/utils";
import { MAP_COL_ULTIMAS_VENDAS } from "../constants/constants";
import { getColorData } from "../services/comprasItens.service";

const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  ultimasVendas: {
    type: Array as () => iUltimaVenda[],
    default: [],
  },
});

const state = reactive({
  tipoVisualizacao: <iTipoVisualizacao>"lista",
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
      v-if="loading"
      class="container-skeleton"
    >
      <Skeleton
        v-for="i in 3"
        height="24px"
      ></Skeleton>
    </div>
    <div
      v-if="!loading && ultimasVendas.length == 0"
      class="d-flex align-center justify-center pt-8"
    >
      <span>Nenhuma venda :(</span>
    </div>
    <div
      v-else-if="!loading && state.tipoVisualizacao == 'unica'"
      class="historico-ultima-venda-dados"
    >
      <div class="d-flex justify-space-between">
        <div>
          <span class="mr-1">Data:</span>
          <strong :style="{ color: getColorData(ultimasVendas[0][MAP_COL_ULTIMAS_VENDAS.DATA]) }">{{
            utils.dataBrasil(ultimasVendas[0][MAP_COL_ULTIMAS_VENDAS.DATA])
          }}</strong>
        </div>
        <div>
          <span class="mr-1">Qtd:</span>
          <strong>{{ ultimasVendas[0][MAP_COL_ULTIMAS_VENDAS.QTD] }}</strong>
        </div>
      </div>
      <div class="d-flex justify-space-between">
        <div>
          <span class="mr-1">Vendedor:</span>
          <strong>{{ ultimasVendas[0][MAP_COL_ULTIMAS_VENDAS.VENDEDOR] }}</strong>
        </div>
        <div>
          <span class="mr-1">Valor:</span>
          <strong>{{ utils.formatValor(ultimasVendas[0][MAP_COL_ULTIMAS_VENDAS.VALOR]) }}</strong>
        </div>
      </div>
      <div>
        <div>
          <span class="mr-1">Cliente:</span>
          <strong>{{ ultimasVendas[0][MAP_COL_ULTIMAS_VENDAS.CLIENTE] }}</strong>
        </div>
      </div>
    </div>
    <div
      v-else-if="!loading && state.tipoVisualizacao == 'lista'"
      class="historico-ultima-venda-lista"
    >
      <div
        class="historico-ultima-venda-lista-card"
        v-for="venda in ultimasVendas"
      >
        <div class="text-truncate">
          <span>{{ venda[MAP_COL_ULTIMAS_VENDAS.CLIENTE] }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>OR {{ venda[MAP_COL_ULTIMAS_VENDAS.NUM_ORCAMENTO] }}</span>
          <span :style="{ color: getColorData(venda[MAP_COL_ULTIMAS_VENDAS.DATA]) }">
            {{ utils.dataBrasil(venda[MAP_COL_ULTIMAS_VENDAS.DATA]) }}</span
          >
          <span>{{ utils.formatValor(venda[MAP_COL_ULTIMAS_VENDAS.VALOR]) }}</span>
          <div
            class="text-truncate"
            style="width: 100px; text-align: right"
          >
            <span>{{ venda[MAP_COL_ULTIMAS_VENDAS.VENDEDOR] }}</span>
          </div>
        </div>
        <div
          class="historico-ultima-venda-lista-card-qtd"
          :class="{
            'historico-ultima-venda-lista-card-qtd-orange':
              venda[MAP_COL_ULTIMAS_VENDAS.MESMO_GRUPO] == 1 ? true : false,
          }"
        >
          {{ venda[MAP_COL_ULTIMAS_VENDAS.QTD] }}
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
  margin-top: 8px;
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

.container-skeleton {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  padding-right: 4px;
}
</style>
