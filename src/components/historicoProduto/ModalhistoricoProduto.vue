<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./modalhistoricoProduto";
import ModalHistoricoDetalhesVenda from "./components/ModalHistoricoDetalhesVenda.vue";
import GroupCard from "./components/GroupCard.vue";
import CardEntrada from "./components/CardEntrada.vue";
import CardSaida from "./components/CardSaida.vue";
import CardEstoque from "./components/CardEstoque.vue";
import CardDevolucao from "./components/CardDevolucao.vue";
import CardPedido from "./components/CardPedido.vue";

const props = defineProps<{
  codProduto: number;
}>();

onMounted(async () => {
  await actions.init(props.codProduto);
});
</script>

<template>
  <card
    class="bg-white border"
    style="min-width: 1200px; width: 1200px; height: 597px; max-height: 597px"
  >
    <div class="d-flex flex-column pa-3 h-100">
      <div v-if="state.loadingSkeletonDadosIniciais">
        <v-skeleton-loader
          type="text"
          class="mb-"
          width="200"
        />
        <v-skeleton-loader
          type="text"
          class="mb-1"
          width="150"
        />

        <v-card class="d-flex pa-4 bg-grey-lighten-4 justify-space-between">
          <div class="d-flex flex-row">
            <v-skeleton-loader
              v-for="n in 12"
              :key="n"
              class="mr-2"
              width="80"
              height="50"
            />
          </div>
        </v-card>
      </div>

      <div v-else>
        <div class="d-flex justify-space-between align-center">
          <v-text class="text-h6 mb-1">{{ state.nomeProduto }}</v-text>

          <v-text
            class="text-caption-1 mb-1"
            v-if="!state.loadingSkeletonTextoVendaMeses"
          >
            venda últimos 12 meses
          </v-text>
        </div>
        <div
          class="d-flex justify-space-between"
          v-if="!state.loadingSkeletonDadosIniciais"
        >
          <div
            v-for="data in state.meses"
            :key="`${data.MES}-${data.ANO}`"
            class="d-flex flex-row"
          >
            <v-card
              class="border mr-2 pa-2 rounded align-center"
              :class="data.ATUAL ? 'bg-blue-lighten-4' : 'bg-white'"
              elevation="1"
            >
              <h3 class="text-center text-subtitle-2">
                {{ `${data.MES} - ${data.ANO}` }}
              </h3>
              <h5 class="text-center text-subtitle-1 font-weight-bold">
                {{ data.QUANTIDADE }}
              </h5>
            </v-card>
          </div>
        </div>
      </div>

      <div class="d-flex flex-grow-1 ga-2 pt-2">
        <GroupCard
          title="Entradas"
          icon="mdi mdi-package-variant-closed"
          bg-cor-titulo="bg-deep-purple-accent-3"
          :loading="state.loadingSkeletonEntrada"
          :possui-dados="state.entradas.length"
          :exibir-ver-mais="state.verMaisEntradas"
          @ver-mais="actions.getEntradaHistoricoProduto"
          :skeleton="state.loadingSkeletonEntrada"
          produto-nao-encontrado="Não possui entrada"
        >
          <CardEntrada
            v-for="entrada in state.entradas"
            :key="entrada.NUM_NOTA_FISCAL"
            :data-entrada="entrada.DATA_ENTRADA"
            :num-nota-fiscal="entrada.NUM_NOTA_FISCAL"
            :nome-fantasia="entrada.NOME_FANTAZIA"
            :custo="entrada.CUSTO"
            :qto-old="entrada.QTO_OLD"
            :quantidade="entrada.QUANTIDADE"
          />
        </GroupCard>

        <GroupCard
          title="Saídas"
          icon="mdi mdi-cash"
          bg-cor-titulo="bg-pink-darken-1"
          :loading="state.loadingSkeletonSaida"
          :possui-dados="state.saidas.length"
          :exibir-ver-mais="state.verMaisSaidas"
          @ver-mais="actions.getSaidas"
          :skeleton="state.loadingSkeletonSaida"
          produto-nao-encontrado="Não possui saida"
        >
          <CardSaida
            v-for="saida in state.saidas"
            :key="saida.NUM_ORCAMENTO"
            :data-venda="saida.DATA_VENDA"
            :orcamento="saida.NUM_ORCAMENTO"
            :nome-cliente="saida.CLIENTE"
            :vendedor="saida.VENDEDOR"
            :valor-venda="saida.VALOR_VENDA"
            :quantidade="saida.QUANTIDADE"
            :skeleton="state.loadingSkeletonSaida"
            @modalSaida="actions.onclickModalSaidas(saida)"
          />
        </GroupCard>
        <GroupCard
          title="Estoque"
          icon="mdi mdi-chart-box-outline"
          bg-cor-titulo="bg-blue-darken-2"
          :loading="state.loadingSkeletonEstoque"
          :possui-dados="state.estoques.length"
          :exibir-ver-mais="state.verMaisEstoque"
          @ver-mais="actions.getEstoquesNew"
          :skeleton="state.loadingSkeletonEstoque"
          produto-nao-encontrado="Não possui estoque"
        >
          <CardEstoque
            v-for="estoque in state.estoques"
            :key="estoque.ID_LOG"
            :dh-log="estoque.DH_LOG"
            :estoquista="estoque.ESTOQUISTA"
            :conteudo="estoque.CONTEUDO"
            :skeleton="state.loadingSkeletonEstoque"
          />
        </GroupCard>

        <GroupCard
          title="Devolução"
          icon="mdi mdi-arrow-u-left-bottom "
          bg-cor-titulo="bg-green-darken-2"
          :possui-dados="state.devolucoes.length"
          :exibir-ver-mais="state.verMaisDevolucoes"
          @ver-mais="actions.getDevolucoes"
          :skeleton="state.loadingSkeletonDevolucao"
          produto-nao-encontrado="Não possui devolução"
        >
          <CardDevolucao
            v-for="devolucao in state.devolucoes"
            :dt-devolucao="devolucao.DT_DEVOLUCAO"
            :num-orcamento="devolucao.NUM_ORCAMENTO"
            :dt-orcamento="devolucao.DT_ORCAMENTO"
            :quantidade="devolucao.QUANTIDADE"
            :skeleton="state.loadingSkeletonDevolucao"
          />
        </GroupCard>

        <GroupCard
          title="pedidos"
          icon="mdi mdi-cart-variant"
          bg-cor-titulo="bg-orange-darken-2"
          :possui-dados="state.estoques.length"
          :exibir-ver-mais="state.verMaisCompras"
          @ver-mais="actions.getCompras"
          :skeleton="state.loadingSkeletonCompras"
          produto-nao-encontrado="Não possui pedidos"
        >
          <CardPedido
            v-for="compra in state.compras"
            :data="compra.DATA"
            :id-compra="compra.ID_COMPRAS"
            :comprador="compra.COMPRADOR"
            :quantidade="compra.QUANTIDADE"
            :skeleton="state.loadingSkeletonCompras"
          />
        </GroupCard>
      </div>
    </div>
  </card>
  <v-dialog
    v-model="state.modalAbrirHistoricoSaida"
    max-width="900px"
  >
    <ModalHistoricoDetalhesVenda
      :orcamento="state.orcamento"
      :orcamento-itens="state.orcamentoItens"
    />
  </v-dialog>
</template>
