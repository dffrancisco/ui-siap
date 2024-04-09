<script setup lang="ts">
import Cabecalho from "./components/Cabecalho.vue";
import Filtros from "./components/Filtros.vue";
import HistoricoMeses from "./components/HistoricoMeses.vue";
import HistoricoUltimasVendas from "./components/HistoricoUltimasVendas.vue";
import HistoricoUltimasCompras from "./components/HistoricoUltimasCompras.vue";
import ItensNaoAdicionados from "./components/ItensNaoAdicionados.vue";
import ItensResumo from "./components/ItensResumo.vue";
import { state, actions, computeds } from "./comprasItens";

actions.init();
</script>

<template>
  <title>Compras</title>

  <div class="compras-itens-container">
    <div class="compras-itens">
      <Cabecalho :cabecalho="state.cabecalho" />
      <Filtros />
      <div class="compras-detalhes">
        <div class="compras-grupo-historico">
          <div class="historico-cabecalho">
            <div
              class="historico-cabecalho-opcao click"
              :class="{ 'historico-cabecalho-opcao-selecionada': state.abaHistorico == 'vendas' }"
              @click="actions.setAbaHistorico('vendas')"
            >
              <span>Vendas</span>
            </div>
            <div
              class="historico-cabecalho-opcao click"
              :class="{ 'historico-cabecalho-opcao-selecionada': state.abaHistorico == 'compras' }"
              @click="actions.setAbaHistorico('compras')"
            >
              <span>Compras</span>
            </div>
            <div class="d-flex flex-grow-1 justify-end">
              <v-icon>mdi mdi-cog</v-icon>
            </div>
          </div>
          <HistoricoMeses
            :label="`Histórico de ${state.abaHistorico}`"
            :historicoMeses="computeds.historicoMeses.value"
            :corPadrao="state.abaHistorico == 'vendas' ? '#7dc1ff' : '#17b5bf'"
            :corDestaque="state.abaHistorico == 'vendas' ? '#b1daff' : '#60e4ec'"
            :corFonte="state.abaHistorico == 'vendas' ? '#005098' : '#00284c'"
          />
          <HistoricoUltimasVendas
            v-if="state.abaHistorico == 'vendas'"
            :ultimasVendas="state.ultimasVendas"
          />
          <HistoricoUltimasCompras
            v-if="state.abaHistorico == 'compras'"
            :ultimasCompras="state.ultimasCompras"
          />
        </div>
        <div class="compras-detalhes-itens">
          <div class="compras-detalhes-dados-item-cabecalho">
            <div
              class="compras-detalhes-dados-item-cabecalho-opcao"
              :class="{
                'compras-detalhes-dados-item-cabecalho-opcao-selecionada': state.abaItens == 'nao_adicionados',
              }"
              @click="actions.setAbaItens('nao_adicionados')"
            >
              <span>Itens não adicionados</span>
            </div>
            <div
              class="compras-detalhes-dados-item-cabecalho-opcao"
              :class="{
                'compras-detalhes-dados-item-cabecalho-opcao-selecionada': state.abaItens == 'adicionados',
              }"
              @click="actions.setAbaItens('adicionados')"
            >
              <span>Itens adicionados</span>
            </div>
            <v-spacer />
            <div class="d-flex align-center">
              <v-icon
                v-if="state.tipoVisualizacaoItem == 'unica'"
                title="Modo Grid"
                @click="actions.setTipoVisualizacaoItem('lista')"
                >mdi mdi-menu</v-icon
              >
              <v-icon
                v-if="state.tipoVisualizacaoItem == 'lista'"
                title="Modo Individual"
                @click="actions.setTipoVisualizacaoItem('unica')"
                >mdi mdi-id-card</v-icon
              >
            </div>
          </div>
          <div
            v-if="state.abaItens == 'nao_adicionados'"
            class="compras-detalhes-dados-item"
          >
            <ItensNaoAdicionados />

            <div class="compras-detalhes-itens-progresso">
              <VProgressLinear
                model-value="50"
                color="primary"
                :rounded-bar="true"
              />
            </div>

            <ItensResumo />

            <div class="compras-detalhes-ultimo-item">
              <span class="mr-2">Último item adicionado: </span>
              <strong class="compras-detalhes-ultimo-item-value">FAROL ARTEB LD 00/</strong>
            </div>
          </div>
        </div>
      </div>
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
      <div id="pnCodigoTela">comprasItens</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.compras-itens-container {
  width: 100vw;
  height: 100vh;
  background: #161b21;
  display: flex;
  justify-content: center;
  overflow-y: auto;
}

.compras-itens {
  display: flex;
  flex-direction: column;
  width: 1116px;
  gap: 12px;
  padding: 20px 0;
}

.compras-detalhes {
  display: flex;
  gap: 12px;
  color: var(--grey-100);
}

.compras-grupo-historico {
  width: 316px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.historico-cabecalho {
  padding: 0 24px;
  background-color: var(--grey-800);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  height: 40px;
  align-items: center;
  gap: 40px;
}

.historico-cabecalho-opcao {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
}

.historico-cabecalho-opcao-selecionada {
  color: var(--primary-500);
  border-bottom: 1px solid var(--primary-500);
}

.compras-detalhes-itens {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 788px;
}

.compras-detalhes-dados-item {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 8px;
  gap: 12px;
}

.compras-detalhes-dados-item-cabecalho {
  display: flex;
  gap: 40px;
  padding: 0 24px;
  background-color: var(--grey-800);
  height: 40px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-size: 14px;
}

.compras-detalhes-dados-item-cabecalho-opcao {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  cursor: pointer;
}

.compras-detalhes-dados-item-cabecalho-opcao-selecionada {
  color: var(--primary-500);
  border-bottom: 1px solid var(--primary-500);
}

.compras-detalhes-ultimo-item {
  padding: 12px;
  width: 100%;
  background-color: var(--grey-900);
  border-radius: 8px;
}

.compras-detalhes-ultimo-item-value {
  font-size: 16px;
  font-weight: 900;
}
</style>
