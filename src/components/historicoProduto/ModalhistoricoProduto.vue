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
  <card class="bg-white border container_modal">
    <div class="d-flex flex-column pa-3 h-100">
      <div v-if="state.loadingDadosIniciais">
        <div class="d-flex justify-space-between">
          <v-skeleton-loader
            type="text"
            class="mb-1"
            width="200"
          />
          <v-skeleton-loader
            type="text"
            class="mb-1"
            width="150"
          />
        </div>

        <v-card class="d-flex pa-2 bg-grey-lighten-4 justify-space-between">
          <div class="d-flex flex-row">
            <v-skeleton-loader
              v-for="n in 12"
              :key="n"
              class="mr-4"
              width="80"
              height="30"
            />
          </div>
        </v-card>
      </div>

      <div v-else>
        <div class="d-flex justify-space-between align-center">
          <v-text class="text-h6 mb-1">{{ state.nomeProduto }}</v-text>

          <v-text
            class="text-caption-1 mb-1"
            v-if="!state.loadingTextoVendaMeses"
          >
            Vendas dos últimos 12 meses
          </v-text>
        </div>
        <div
          class="d-flex justify-space-between"
          v-if="!state.loadingDadosIniciais"
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
          produto-nao-encontrado="Não possui entrada"
          :loading="state.loadingEntrada"
          :possui-dados="state.entradas.length"
          :exibir-ver-mais="state.verMaisEntradas"
          @ver-mais="actions.getEntradaHistoricoProduto"
        >
          <CardEntrada
            v-for="entrada in state.entradas"
            cor-destaque="bg-deep-purple-accent-3"
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
          produto-nao-encontrado="Não possui saida"
          :loading="state.loadingSaida"
          :possui-dados="state.saidas.length"
          :exibir-ver-mais="state.verMaisSaidas"
          @ver-mais="actions.getSaidas"
        >
          <CardSaida
            v-for="saida in state.saidas"
            cor-destaque="bg-pink-darken-1"
            :key="saida.NUM_ORCAMENTO"
            :data-venda="saida.DATA_VENDA"
            :orcamento="saida.NUM_ORCAMENTO"
            :nome-cliente="saida.CLIENTE"
            :vendedor="saida.VENDEDOR"
            :valor-venda="saida.VALOR_VENDA"
            :quantidade="saida.QUANTIDADE"
            @modalSaida="actions.onclickModalSaidas(saida)"
          />
        </GroupCard>
        <GroupCard
          title="Estoque"
          icon="mdi mdi-chart-box-outline"
          bg-cor-titulo="bg-blue-darken-2"
          produto-nao-encontrado="Não possui estoque"
          :loading="state.loadingEstoque"
          :possui-dados="state.estoques.length"
          :exibir-ver-mais="state.verMaisEstoque"
          @ver-mais="actions.getEstoquesNew"
        >
          <CardEstoque
            v-for="estoque in state.estoques"
            cor-destaque="bg-blue-darken-2"
            :key="estoque.ID_LOG"
            :dh-log="estoque.DH_LOG"
            :estoquista="estoque.ESTOQUISTA"
            :conteudo="estoque.CONTEUDO"
            :skeleton="state.loadingEstoque"
          />
        </GroupCard>

        <GroupCard
          title="Devolução"
          icon="mdi mdi-arrow-u-left-bottom "
          bg-cor-titulo="bg-green-darken-2"
          produto-nao-encontrado="Não possui devolução"
          :loading="state.loadingDevolucao"
          :possui-dados="state.devolucoes.length"
          :exibir-ver-mais="state.verMaisDevolucoes"
          :skeleton="state.loadingDevolucao"
          @ver-mais="actions.getDevolucoes"
        >
          <CardDevolucao
            v-for="devolucao in state.devolucoes"
            cor-destaque="bg-green-darken-2"
            :dt-devolucao="devolucao.DT_DEVOLUCAO"
            :num-orcamento="devolucao.NUM_ORCAMENTO"
            :dt-orcamento="devolucao.DT_ORCAMENTO"
            :quantidade="devolucao.QUANTIDADE"
            :skeleton="state.loadingDevolucao"
          />
        </GroupCard>

        <GroupCard
          title="pedidos"
          icon="mdi mdi-cart-variant"
          bg-cor-titulo="bg-orange-darken-2"
          produto-nao-encontrado="Não possui pedidos"
          :loading="state.loadingCompras"
          :possui-dados="state.compras.length"
          :exibir-ver-mais="state.verMaisCompras"
          @ver-mais="actions.getCompras"
        >
          <CardPedido
            v-for="compra in state.compras"
            cor-destaque="bg-orange-darken-2"
            :data="compra.DATA"
            :id-compra="compra.ID_COMPRAS"
            :comprador="compra.COMPRADOR"
            :quantidade="compra.QUANTIDADE"
            :skeleton="state.loadingCompras"
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
<style scoped>
.container_modal {
  min-width: 1200px;
  width: 1200px;
  height: 597px;
  max-height: 597px;
}
</style>
