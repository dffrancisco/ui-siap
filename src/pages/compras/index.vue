<script setup lang="ts">
import { dataBrasil, formatValor } from "@/ts/utils";
import ModalDadosPedido from "./components/ModalDadosPedido.vue";
import ModalImpressao from "./components/ModalImpressao.vue";

import {
  state,
  actions,
  marcasAgrupadas,
  valorPendente,
  qtdPedidosMaisDe20Dias,
  comprasFiltradas,
} from "./compras";

actions.init();
</script>

<template>
  <title>Compras</title>

  <div
    class="compras-container"
    @keydown="actions.onKeyDown"
    tabindex="0"
  >
    <div class="compras">
      <div class="compras__titulo">COMPRAS</div>
      <div class="compras__dashboard">
        <v-card class="compras__dashboard__card">
          <span>Pedidos Pend.</span>
          <strong class="compras__dashboard__card__titulo">
            {{ comprasFiltradas.length }}
          </strong>
        </v-card>
        <v-card class="compras__dashboard__card">
          <span>Valor Pendente</span>
          <strong class="compras__dashboard__card__titulo">
            {{ formatValor(valorPendente) }}
          </strong>
        </v-card>
        <v-card class="compras__dashboard__card compras__dashboard__card--red">
          <span>Pedidos 20D+</span>
          <strong class="compras__dashboard__card__titulo">
            {{ qtdPedidosMaisDe20Dias }}
          </strong>
        </v-card>
      </div>
      <div class="compras__dados">
        <div class="compras__marcas">
          <div class="compras__marcas__pesquisa">
            <div class="input-group-dark">
              <input
                id="edtMarca"
                class="input-dark"
                placeholder="informe a marca (F2)"
                v-model="state.edtMarca"
                @keypress.enter="actions.onKeyPressEnterMarca"
              />
            </div>
          </div>
          <div class="compras__marcas__lista">
            <div
              v-for="marca in marcasAgrupadas"
              class="compras__marcas__card"
              :class="{ 'compras__marcas__card--selecionada': state.nomeMarcaSelecionada == marca.nomeMarca }"
              @click="state.nomeMarcaSelecionada = marca.nomeMarca"
            >
              <div class="compras__marcas__card__contador"> {{ marca.qtd }} </div>
              <div class="compras__marcas__card__dados">
                <span>{{ marca.nomeMarca }}</span>
                <span>{{ formatValor(marca.valor) }}</span>
              </div>
            </div>
          </div>
        </div>
        <v-divider
          vertical
          color="grey"
        ></v-divider>
        <div class="compras__lista">
          <v-data-table
            class="compras__grid"
            itemsPerPage="-1"
            :fixed-footer="false"
            :items="comprasFiltradas"
            :headers="[
              {
                title: 'Nº Pedido',
                key: 'ID_COMPRAS',
                align: 'start',
                sortable: true,
              },
              {
                title: 'Marca',
                key: 'NOME_MARCA',
                align: 'start',
                sortable: true,
              },
              {
                title: 'Data',
                key: 'DATA',
                align: 'center',
                sortable: true,
              },
              {
                title: 'Valor',
                key: 'VALOR',
                align: 'center',
                sortable: true,
              },
              {
                title: 'Comprador',
                key: 'COMPRADOR',
                align: 'start',
                sortable: true,
              },
              {
                title: 'Ações',
                key: 'ACOES',
                align: 'center',
                sortable: false,
              },
            ]"
          >
            <template v-slot:item.DATA="{ value }">
              {{ dataBrasil(value) }}
            </template>
            <template v-slot:item.VALOR="{ value }">
              {{ formatValor(value) }}
            </template>
            <template v-slot:item.ACOES="{ item }">
              <div>
                <v-icon
                  title="Itens do pedido"
                  size="x-large"
                  @click="actions.redirectToItensdoPedido(item.ID_COMPRAS, item.ID_MARCA)"
                  >mdi mdi-cart</v-icon
                >
                <v-icon
                  title="Alterar cabeçalho"
                  size="x-large"
                  @click="actions.onClickAlterarCompra(item)"
                  >mdi mdi-pencil</v-icon
                >
                <v-icon
                  size="x-large"
                  title="Imprimir pedido"
                  @click="actions.onClickImprimir(item)"
                  >mdi mdi-printer</v-icon
                >
                <v-icon
                  title="Deletar pedido"
                  class="compras__grid__btn--red"
                  size="x-large"
                  @click="actions.onClickDeletarCompra(item)"
                >
                  mdi mdi-trash-can
                </v-icon>
              </div>
            </template>
            <template v-slot:bottom> </template>
          </v-data-table>
          <div class="compras__grid__footer">
            <v-btn
              @click="actions.onClickNovoPedido"
              class="compras__btn-novo-pedido"
              >Novo Pedido (F1)</v-btn
            >
          </div>
        </div>
      </div>
      <v-dialog
        v-model="state.modalDadosPedidoOpened"
        max-width="480px"
        transition="dialog-transition"
        :persistent="true"
      >
        <ModalDadosPedido
          :marcas="state.marcas"
          :compraAlterar="state.compraAlterar"
          @insertCompra="actions.insertCompra"
          @updateCompra="actions.updateCompra"
          @closeModal="actions.closeModalDadosPedido"
        />
      </v-dialog>
      <v-dialog
        v-model="state.modalImpressaoOpened"
        max-width="480px"
        transition="dialog-transition"
      >
        <ModalImpressao
          :transportadoras="state.transportadoras"
          :objProdutosAdicionados="state.objProdutosAdicionados"
          :marca="state.dadosImpressao?.NOME_MARCA"
          :observacao="state.dadosImpressao?.OBSERVACAO"
          @fecharModal="actions.closeModalImpressao"
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
      <div id="pnCodigoTela">COMPRAS</div>
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
.input-group-dark {
  display: flex;
  gap: 4px;
  padding: 10px;
  color: var(--grey-400);
  font-size: 14px;
  background-color: var(--grey-800);
  border-radius: 6px;
}

.input-dark {
  color: var(--grey-400);
  font-size: 14px;
  width: 100%;
  height: 24px;
}

.compras-container {
  width: 100vw;
  height: 100vh;
  background: #161b21;
  display: flex;
  justify-content: center;
  overflow-y: auto;
}

.compras {
  display: flex;
  flex-direction: column;
  width: 1116px;
  gap: 12px;
}

.compras__titulo {
  padding: 10px 0 0;
  color: var(--grey-100);
  font-size: 24px;
  font-weight: bold;
}

.compras__dashboard {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.compras__dashboard__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: var(--primary-600);
  font-size: 18px;
  color: var(--grey-100);
  font-weight: 500;
}

.compras__dashboard__card--red {
  background-color: var(--danger-600);
}

.compras__dashboard__card__titulo {
  font-size: 24px;
  font-weight: bold;
}

.compras__dados {
  display: flex;
  width: 100%;
  padding: 12px 0;
  gap: 10px;
  border-radius: 8px;
  background-color: var(--grey-900);
}

.compras__marcas {
  width: 336px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compras__marcas__pesquisa {
  padding: 0 8px;
}

.compras__marcas__lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 58vh;
  overflow-y: auto;
  padding: 0 8px;
}

.compras__marcas__card {
  display: flex;
  align-items: center;
  padding: 6px 6px;
  background-color: var(--grey-800);
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  color: var(--grey-100);
  cursor: pointer;
}

.compras__marcas__card--selecionada {
  background-color: var(--grey-700);
  box-shadow: inset 0 0 0 2px var(--primary-600);
}

.compras__marcas__card__contador {
  background-color: var(--grey-100);
  color: var(--primary-600);
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
}

.compras__marcas__card__dados {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.compras__lista {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 750px;
  gap: 12px;
}

.compras__grid {
  background-color: var(--grey-900);
  color: var(--grey-100);
  max-width: 100%;
  height: 58vh;
  overflow-y: auto;
}

.compras__grid__btn--red {
  color: var(--danger-600);
}

.compras__grid__footer {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
}

.compras__btn-novo-pedido {
  background-color: var(--success-600);
  color: var(--grey-100);
}
</style>
