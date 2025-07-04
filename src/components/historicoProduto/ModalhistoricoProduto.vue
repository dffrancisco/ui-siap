<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./modalhistoricoProduto";
import { dataBrasil, formatHora, formatValor } from "@/ts/utils";
import Loading from "@/components/Loading.vue";
import ModalHistoricoDetalhesVenda from "./components/ModalHistoricoDetalhesVenda.vue";

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
    style="min-width: 1200px; width: 1200px; height: 100vh"
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
        <!-- card entrada -->
        <v-card
          :class="
            state.entradas.length > 0
              ? 'container_card_list bg-grey-lighten-4'
              : 'container_nao_encontrado bg-grey-lighten-4'
          "
        >
          <v-text class="titulo text-h6 bg-deep-purple-accent-3">
            <i class="mdi mdi-package-variant-closed me-2"></i>
            Entradas</v-text
          >

          <div v-if="state.loadingSkeletonEntrada">
            <v-skeleton-loader
              v-for="n in 3"
              :key="n"
              class="mx-2 my-4"
              width="200"
              height="130"
            />
          </div>
          <div
            v-else-if="state.entradas.length > 0"
            class="scroll d-flex flex-column ga-3"
          >
            <v-card
              class="container_card"
              v-for="entrada in state.entradas"
            >
              <div class="cor_identificacao bg-deep-purple-accent-3"></div>
              <div class="container_informação_historico">
                <div class="d-flex justify-space-between">
                  <v-text>{{ dataBrasil(entrada.DATA_ENTRADA) }}</v-text>
                  <v-text class="codigo">#{{ entrada.NUM_NOTA_FISCAL }}</v-text>
                </div>
                <div class="d-flex flex-column mt-2">
                  <v-text>{{ entrada.NOME_FANTAZIA }}</v-text>
                </div>
                <div class="border mt-2"></div>
                <div class="d-flex justify-space-between mt-2">
                  <v-text class="font-weight-bold">{{ formatValor(entrada.CUSTO) }}</v-text>
                  <div>
                    <v-text class="quantidade mr-1">QTD V: {{ entrada.QTO_OLD }}</v-text>
                    <v-text class="quantidade">QTD: {{ entrada.QUANTIDADE }}</v-text>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
          <div
            v-else-if="state.loadingSkeletonEntrada"
            class="d-flex justify-center align-center flex-column pt-5"
          >
            <v-text class="text-h6 text-center text-grey-darken-2"> Nenhuma Entrada encontrada. </v-text>
          </div>
          <div
            class="container_botao px-4"
            v-if="state.verMaisEntradas && state.entradas.length > 0"
          >
            <v-btn
              color="primary"
              primary
              @click="actions.getEntradaHistoricoProduto"
              size="small"
              >ver mais
            </v-btn>
          </div>
        </v-card>

        <!-- card saida-->
        <v-card
          :class="
            state.saidas.length > 0
              ? 'container_card_list bg-grey-lighten-4'
              : 'container_nao_encontrado bg-grey-lighten-4'
          "
        >
          <v-text class="titulo text-h6 bg-pink-darken-1">
            <i class="mdi mdi-cash me-2"></i>
            Saídas</v-text
          >
          <div v-if="state.loadingSkeletonSaida">
            <v-skeleton-loader
              v-for="n in 3"
              :key="n"
              class="mx-2 my-4"
              width="200"
              height="130"
            />
          </div>
          <div
            v-else-if="state.saidas.length > 0"
            class="scroll d-flex flex-column ga-3"
          >
            <v-card
              class="container_card"
              v-for="saida in state.saidas"
              @click="actions.onclickAbrir(saida)"
            >
              <div class="cor_identificacao bg-pink-darken-1"></div>
              <div class="container_informação_historico">
                <div class="d-flex justify-space-between">
                  <v-text>{{ dataBrasil(saida.DATA_VENDA) }}</v-text>
                  <v-text class="codigo">#{{ saida.NUM_ORCAMENTO }}</v-text>
                </div>
                <div class="d-flex flex-column mt-2">
                  <v-text class="font-weight-bold">{{ saida.NOME_CLIENTE }}</v-text>
                  <v-text>{{ saida.VENDEDOR }}</v-text>
                </div>
                <div class="border mt-2"></div>
                <div class="d-flex justify-space-between mt-2">
                  <v-text class="font-weight-bold"> {{ formatValor(saida.VALOR_VENDA) }} </v-text>
                  <v-text class="quantidade">QTD: {{ saida.QUANTIDADE }}</v-text>
                </div>
              </div>
            </v-card>
          </div>
          <div
            v-else-if="state.loadingSkeletonSaida"
            class="d-flex justify-center align-center flex-column pt-5"
          >
            <v-text class="text-h6 text-center text-grey-darken-2"> Nenhuma Saída encontrada. </v-text>
          </div>
          <div
            class="container_botao"
            v-if="state.verMaisSaidas && state.saidas.length > 0"
          >
            <div
              class="botao_ver_mais"
              @click="actions.getSaidas"
              >ver mais
            </div>
          </div>
        </v-card>

        <!-- card estoque -->
        <v-card
          :class="
            state.estoques.length > 0
              ? 'container_card_list bg-grey-lighten-4'
              : 'container_nao_encontrado bg-grey-lighten-4'
          "
        >
          <v-text class="titulo text-h6 bg-blue-darken-2">
            <i class="mdi mdi-chart-box-outline me-2"></i>
            Estoque</v-text
          >
          <div v-if="state.loadingSkeletonEstoque">
            <v-skeleton-loader
              v-for="n in 3"
              :key="n"
              class="mx-2 my-4"
              width="200"
              height="130"
            />
          </div>
          <div
            v-if="state.estoques.length > 0"
            class="scroll d-flex flex-column ga-3"
          >
            <v-card
              class="container_card"
              v-for="estoque in state.estoques"
            >
              <div class="cor_identificacao bg-blue-darken-2"></div>
              <div class="container_informação_historico">
                <div class="d-flex justify-space-between">
                  <v-text>{{ dataBrasil(estoque.DH_LOG) }}</v-text>
                  <v-text class="codigo">{{ formatHora(estoque.DH_LOG) }}</v-text>
                </div>
                <div class="d-flex flex-column mt-2">
                  <v-text class="font-weight-bold">{{ estoque.ESTOQUISTA }}</v-text>
                  <v-text class="text-subtitle-2">{{ estoque.CONTEUDO }}</v-text>
                </div>
              </div>
            </v-card>
          </div>
          <div
            v-else-if="state.loadingSkeletonEstoque"
            class="d-flex justify-center align-center flex-column pt-5"
          >
            <v-text class="text-h6 text-center text-grey-darken-2"> Nenhum Estoque encontrado. </v-text>
          </div>
          <div
            class="container_botao"
            v-if="state.verMaisEstoque && state.estoques.length > 0"
          >
            <div
              class="botao_ver_mais"
              @click="actions.getEstoquesNew"
              >ver mais
            </div>
          </div>
        </v-card>

        <!-- card devolução -->
        <v-card
          :class="
            state.devolucoes.length > 0
              ? 'container_card_list bg-grey-lighten-4'
              : 'container_nao_encontrado bg-grey-lighten-4'
          "
        >
          <v-text class="titulo text-h6 bg-green-darken-2">
            <i class="mdi mdi-arrow-u-left-bottom me-2"></i>
            Devolução</v-text
          >
          <div v-if="state.loadingSkeletonEstoque">
            <v-skeleton-loader
              v-for="n in 3"
              :key="n"
              class="mx-2 my-4"
              width="200"
              height="130"
            />
          </div>
          <div
            v-if="state.devolucoes.length > 0"
            class="scroll d-flex flex-column ga-3"
          >
            <v-card
              class="container_card"
              v-for="devolucao in state.devolucoes"
            >
              <div class="cor_identificacao bg-green-darken-2"></div>
              <div class="container_informação_historico">
                <div class="d-flex justify-space-between">
                  <v-text>{{ dataBrasil(devolucao.DT_DEVOLUCAO) }}</v-text>
                  <v-text class="codigo">#{{ devolucao.NUM_ORCAMENTO }}</v-text>
                </div>
                <div class="d-flex flex-column mt-2">
                  <v-text>Data da venda:</v-text>
                  <v-text class="font-weight-bold"> {{ dataBrasil(devolucao.DT_ORCAMENTO) }}</v-text>
                </div>
                <div class="border mt-2"></div>
                <div class="d-flex justify-space-between mt-2">
                  <v-text></v-text>
                  <v-text class="quantidade">QTD: {{ devolucao.QUANTIDADE }}</v-text>
                </div>
              </div>
            </v-card>
          </div>
          <div
            v-else-if="state.loadingSkeletonDevolucao"
            class="d-flex justify-center align-center flex-column pt-5"
          >
            <v-text class="text-h6 text-center text-grey-darken-2"> Nenhuma Devolução encontrada. </v-text>
          </div>
          <div
            class="container_botao"
            v-if="state.verMaisDevolucoes && state.devolucoes.length > 0"
          >
            <div
              class="botao_ver_mais"
              @click="actions.getDevolucoes"
              >ver mais
            </div>
          </div>
        </v-card>

        <!-- card Pedidos -->
        <v-card
          :class="
            state.compras.length > 0
              ? 'container_card_list bg-grey-lighten-4'
              : 'container_nao_encontrado bg-grey-lighten-4'
          "
        >
          <v-text class="titulo text-h6 bg-orange-darken-2">
            <i class="mdi mdi-cart-variant me-2"></i>
            Pedidos</v-text
          >
          <div v-if="state.loadingSkeletonEstoque">
            <v-skeleton-loader
              v-for="n in 3"
              :key="n"
              class="mx-2 my-4"
              width="200"
              height="130"
            />
          </div>
          <div
            v-if="state.compras.length > 0"
            class="scroll d-flex flex-column ga-3"
          >
            <v-card
              class="container_card"
              v-for="compra in state.compras"
            >
              <div class="cor_identificacao bg-orange-darken-2"></div>
              <div class="container_informação_historico">
                <div class="d-flex justify-space-between">
                  <v-text>{{ dataBrasil(compra.DATA) }}</v-text>
                  <v-text class="codigo">#{{ compra.ID_COMPRAS }}</v-text>
                </div>
                <div class="d-flex flex-column mt-2">
                  <v-text>Comprador: </v-text>
                  <v-text class="font-weight-bold">{{ compra.COMPRADOR }} </v-text>
                </div>
                <div class="border mt-2"></div>
                <div class="d-flex justify-end mt-2">
                  <v-text class="quantidade">QTD: {{ compra.QUANTIDADE }}</v-text>
                </div>
              </div>
            </v-card>
          </div>
          <div
            v-else-if="state.loadingSkeletonCompras"
            class="d-flex justify-center align-center flex-column pt-5"
          >
            <v-text class="text-h6 text-center text-grey-darken-2"> Nenhum Pedido encontrado. </v-text>
          </div>
          <div
            class="container_botao"
            v-if="state.verMaisCompras && state.compras.length > 2"
          >
            <div
              class="botao_ver_mais"
              @click="actions.getCompras"
              >ver mais
            </div>
          </div>
        </v-card>
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

  <Loading :loading="state.loading" />
</template>

<style scoped>
.container_card_list {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.scroll {
  height: 100%;
  overflow: auto;
}
.scroll::-webkit-scrollbar {
  width: 10px;
  height: 20px;
  margin-top: 20px;
}
.scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}
.scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.titulo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  height: 25px;
  width: 100%;
}
.cor_identificacao {
  width: 5px;
}
.container_informação_historico {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 4px 8px;
}
.quantidade,
.codigo {
  background-color: #cfd8dc;
  border-radius: 5px;
  padding: 0 5px;
}
.container_card {
  display: flex;
  margin: 0px 8px;
  min-height: 120px;
}
.container_botao {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.botao_ver_mais {
  background-color: #f5f5f5;
  width: 100%;
  margin: 8px;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 30px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s;
  font-size: 16px;
}
.botao_ver_mais:hover {
  background-color: #bdbdbd;
}
.container_nao_encontrado {
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
}
</style>
