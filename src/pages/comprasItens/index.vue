<script setup lang="ts">
import Cabecalho from "./components/Cabecalho.vue";
import Filtros from "./components/Filtros.vue";
import HistoricoMeses from "./components/HistoricoMeses.vue";
import HistoricoUltimasVendas from "./components/HistoricoUltimasVendas.vue";
import HistoricoUltimasCompras from "./components/HistoricoUltimasCompras.vue";
import ItensNaoAdicionados from "./components/ItensNaoAdicionados.vue";
import ItensNaoAdicionadosGrid from "./components/ItensNaoAdicionadosGrid.vue";
import ItensResumo from "./components/ItensResumo.vue";
import { state, actions, computeds } from "./comprasItens";
import ItensAdicionados from "./components/ItensAdicionados.vue";
import { useRoute } from "vue-router";
import { MAP_COL_PRODUTO } from "./constants/constants";
import ModalImpressao from "./components/ModalImpressao.vue";
import ModalItensErro from "./components/ModalItensErro.vue";

const route = useRoute();
state.idCompras = parseInt(route?.query?.idCompras as string);
state.edtMarca = parseInt(route?.query?.idMarca as string);

actions.init();
</script>

<template>
  <title>Compras</title>

  <div class="compras-itens-container">
    <div class="compras-itens">
      <Cabecalho
        :cabecalho="state.cabecalho"
        :marcas="computeds.marcasPedido.value"
        :qtdItens="computeds.contadorItens.value.qtdProdutosAdicionados"
      />
      <Filtros
        :idMarcaInicial="state.cabecalho.ID_MARCA"
        :marcas="state.marcas"
        :carros="state.carros"
        :disablePrint="computeds.disablePrint.value"
        :abaItens="state.abaItens"
        @abrirModalImpressao="actions.abrirModalImpressao"
        @buscarProdutos="actions.buscarProdutos"
        @focarNosItensNaoAdicionados="actions.focarContainerItem"
        @ordenar="actions.setOrdenar"
      />
      <div
        id="compras-detalhes"
        class="compras-detalhes"
        tabindex="0"
        @keydown="actions.onKeydownContainerPrincipal"
      >
        <div class="compras-grupo-historico">
          <div class="historico-cabecalho">
            <div
              class="historico-cabecalho-opcao click"
              :class="{ 'historico-cabecalho-opcao-selecionada': state.abaHistorico == 'vendas' }"
              @click="actions.setAbaHistorico('vendas')"
            >
              <span><u>V</u>endas</span>
            </div>
            <div
              class="historico-cabecalho-opcao click"
              :class="{ 'historico-cabecalho-opcao-selecionada': state.abaHistorico == 'compras' }"
              @click="actions.setAbaHistorico('compras')"
            >
              <span><u>C</u>ompras</span>
            </div>
            <div class="d-flex flex-grow-1 justify-end">
              <div>
                <v-menu
                  v-model="state.menuConfigOpened"
                  :close-on-content-click="false"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props">mdi mdi-cog</v-icon>
                  </template>

                  <v-card
                    color="var(--grey-700)"
                    width=""
                    class="px-4 d-flex flex-column"
                  >
                    <div class="d-flex align-center ga-4">
                      <v-switch
                        v-model="state.verTodosOsItens"
                        color="var(--primary-600)"
                        hide-details
                        @click="actions.btnVerTodosOsItens"
                      ></v-switch>
                      <span
                        style="color: var(--grey-100)"
                        class="text-subtitle-1"
                        >Ver todos os itens</span
                      >
                    </div>
                    <div class="d-flex align-center ga-4">
                      <v-switch
                        v-model="state.verVendasEComprasEntreLojas"
                        color="var(--primary-600)"
                        hide-details
                        @click="actions.btnVerVendasEComprasEntreLojas"
                      ></v-switch>
                      <span
                        style="color: var(--grey-100)"
                        class="text-subtitle-1"
                        >Ver venda entre lojas</span
                      ></div
                    >
                  </v-card>
                </v-menu>
              </div>
            </div>
          </div>
          <HistoricoMeses
            v-if="state.abaHistorico == 'vendas'"
            :label="`Histórico de ${state.abaHistorico}`"
            :historicoMeses="computeds.historicoMeses.value"
            :corPadrao="'#27313e'"
            :corDestaque="'#3d4a5b'"
            :corFonte="'#eef0f4'"
            :media="computeds.mediaQtdItemSelecionado.value"
            :loading="state.loadingHistoricoVendas"
            :isVenda="true"
            :corMediaVenda="computeds.corMediaVenda.value"
            @refreshHistorico="actions.buscarHistorico({ ID_MARCA: state.edtMarca })"
            :historicoErro="state.historicoErro"
          />
          <HistoricoMeses
            v-if="state.abaHistorico == 'compras'"
            :label="`Histórico de ${state.abaHistorico}`"
            :historicoMeses="computeds.historicoMeses.value"
            :corPadrao="'#27313e'"
            :corDestaque="'#3d4a5b'"
            :corFonte="'#eef0f4'"
            :media="computeds.mediaQtdItemSelecionado.value"
            :loading="state.loadingHistoricoCompras"
            @refreshHistorico="actions.buscarHistorico({ ID_MARCA: state.edtMarca })"
            :historicoErro="state.historicoErro"
          />
          <HistoricoUltimasVendas
            v-if="state.abaHistorico == 'vendas'"
            :ultimasVendas="computeds.ultimasVendas.value"
            :loading="state.loadingHistoricoVendas"
          />
          <HistoricoUltimasCompras
            v-if="state.abaHistorico == 'compras'"
            :ultimasCompras="computeds.ultimasCompras.value"
            :loading="state.loadingHistoricoCompras"
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
              <span><u>I</u>tens</span>
            </div>
            <div
              class="compras-detalhes-dados-item-cabecalho-opcao"
              :class="{
                'compras-detalhes-dados-item-cabecalho-opcao-selecionada': state.abaItens == 'adicionados',
              }"
              @click="actions.setAbaItens('adicionados')"
            >
              <span class="mr-2">Itens <u>a</u>dicionados</span>
            </div>
            <v-spacer />
            <div class="compras-detalhes-dados-item-cabecalho-contagem">
              <v-chip
                color="#ff7da1"
                size="x-small"
                @click="actions.openCloseModalItensErro"
              >
                {{ computeds.contadorItens.value.qtdErro }}
              </v-chip>
              <v-chip
                color="#ffc045"
                size="x-small"
              >
                {{ computeds.contadorItens.value.qtdProcessando }}
              </v-chip>
              <v-chip
                color="#95edf2"
                size="x-small"
                title="Itens adicionados"
              >
                {{ computeds.contadorItens.value.qtdProdutosAdicionados }}
              </v-chip>
            </div>
            <div class="d-flex align-center">
              <v-icon
                v-if="state.tipoVisualizacaoItem == 'unica'"
                title="Modo Grid (Alt + M)"
                @click="actions.setTipoVisualizacaoItem('lista')"
                >mdi mdi-menu</v-icon
              >
              <v-icon
                v-if="state.tipoVisualizacaoItem == 'lista'"
                title="Modo Individual (Alt + M)"
                @click="actions.setTipoVisualizacaoItem('unica')"
                >mdi mdi-id-card</v-icon
              >
            </div>
          </div>
          <div
            v-if="state.abaItens == 'nao_adicionados'"
            class="compras-detalhes-dados-item"
          >
            <ItensNaoAdicionados
              v-if="state.tipoVisualizacaoItem == 'unica'"
              :produto="computeds.produtoSelecionado.value"
              :exibirIconeAvancar="computeds.exibirIconeAvancar.value"
              :exibirIconeVoltar="computeds.exibirIconeVoltar.value"
              :qtdJaAdicionada="computeds.qtdJaAdicionadaItem.value"
              :media="computeds.mediaQtdItemSelecionado.value"
              :corMediaVenda="computeds.corMediaVenda.value"
              @adicionarItem="actions.adicionarItem"
              @avancarItem="actions.onClickAvancarItem"
              @voltarItem="actions.onClickVoltarItem"
            />

            <ItensNaoAdicionadosGrid
              v-if="state.tipoVisualizacaoItem == 'lista'"
              :objProdutos="state.produtos"
              :objProdutosAdicionados="state.produtosAdicionados"
              :keysProdutos="state.keyProdutos"
              :indexProdutoSelecionado="state.indexProdutoSelecionado"
              :qtdProdutosAdicionados="computeds.contadorItens.value.qtdProdutosAdicionados"
              :qtdJaAdicionada="computeds.qtdJaAdicionadaItem.value"
              :media="computeds.mediaQtdItemSelecionado.value"
              :corMediaVenda="computeds.corMediaVenda.value"
              @changeIndexProdutoSelecionado="actions.changeIndexProdutoSelecionado"
              @adicionarItem="actions.adicionarItem"
            />

            <div class="compras-detalhes-itens-progresso">
              <VProgressLinear
                :model-value="computeds.progressoNavegacaoItens.value"
                color="primary"
                :rounded-bar="true"
              />
            </div>

            <ItensResumo
              :qtd-itens="state.qtdItensMarca"
              :qtd-itens-vistos="state.qtdMaxItensVistosByMarca['marca:' + state.edtMarca] || 1"
              :item-atual="state.indexProdutoSelecionado + 1"
            />

            <div class="compras-detalhes-ultimo-item">
              <span class="mr-2">Último item adicionado: </span>
              <strong class="compras-detalhes-ultimo-item-value">
                {{ computeds.ultimoItemAdicionado.value[MAP_COL_PRODUTO.DESC_PRODUTO] }}
              </strong>
            </div>
          </div>
          <div
            v-if="state.abaItens == 'adicionados'"
            class="compras-detalhes-dados-item"
          >
            <ItensAdicionados
              :idCompras="state.cabecalho.ID_COMPRAS"
              :objProdutos="state.produtos"
              :objProdutosAdicionados="state.produtosAdicionados"
              :keysProdutos="state.keyProdutos"
              :indexProdutoSelecionado="state.indexProdutoSelecionado"
              :media="computeds.mediaQtdItemSelecionado.value"
              :corMediaVenda="computeds.corMediaVenda.value"
              :qtdJaAdicionada="computeds.qtdJaAdicionadaItem.value"
              :searchDescricaoGridItem="state.searchDescricaoGridItem"
              :searchNumFabGridItem="state.searchNumFabGridItem"
              @changeIndexProdutoSelecionado="actions.changeIndexProdutoSelecionado"
              @adicionarItem="actions.adicionarItem"
              @deletarItem="actions.deletarItem"
              :isAlteracao="state.isAlteracao"
            />
          </div>
        </div>
      </div>
      <v-dialog
        v-model="state.modalImpressaoOpened"
        max-width="480px"
        transition="dialog-transition"
      >
        <ModalImpressao
          :transportadoras="state.transportadoras"
          :objProdutosAdicionados="state.produtosAdicionados"
          :marca="state.cabecalho.NOME_MARCA"
          :observacao="state.cabecalho.OBS"
          :numPedido="state.cabecalho.ID_COMPRAS"
          @fecharModal="actions.fecharModalImpressao"
        />
      </v-dialog>
      <v-dialog
        v-model="state.modalItensErroOpen"
        max-width="480px"
        transition="dialog-transition"
      >
        <ModalItensErro
          @fecharModal="actions.openCloseModalItensErro"
          @tentarInserirItemNovamente="actions.tentarInserirItemComErroNovamente"
          :itensComErro="state.itensComErro"
        />
      </v-dialog>
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
  gap: 8px;
  padding: 10px 0;
}

.compras-detalhes {
  display: flex;
  gap: 8px;
  color: var(--grey-100);
  z-index: 0;
}

.compras-grupo-historico {
  width: 316px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.historico-cabecalho {
  padding: 0 12px;
  background-color: var(--grey-800);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  height: 40px;
  align-items: center;
  gap: 20px;
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
  max-width: 792px;
}

.compras-detalhes-dados-item {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 8px;
  gap: 8px;
}

.compras-detalhes-dados-item-cabecalho {
  display: flex;
  gap: 20px;
  padding: 0 12px;
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

.compras-detalhes-dados-item-cabecalho-contagem {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-right: 6px;
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
