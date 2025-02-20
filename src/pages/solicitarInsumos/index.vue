<script setup lang="ts">
import { state, actions } from "./solicitarInsumos";
import ModalPedidoInsumos from "./components/ModalPedidoInsumos.vue";
import { onMounted } from "vue";
import utils from "@/ts/utils";

onMounted(async () => {
  await actions.init();
});
</script>
<template
  ><v-container
    ><v-card
      :max-width="850"
      class="mx-auto pa-4"
    >
      <v-row class="align-center justify-space-between">
        <v-col
          class="d-flex align-center"
          cols="auto"
        >
          <v-text-field
            label="Ano"
            type="number"
            v-model="state.ano"
            style="max-width: 150px"
            :clearable="false"
          />
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            class="ml-2"
            @click="actions.getPedidos"
          >
          </v-btn>
        </v-col>

        <v-btn
          id="btnNovoCliente"
          color="primary"
          class="mr-5"
          @click="actions.novoPedido"
        >
          Novo Pedido (F2)
        </v-btn>
      </v-row>

      <div
        class="scroll-container"
        v-if="state.pedidos.length > 0"
      >
        <v-row>
          <v-col
            v-for="pedido in state.pedidos"
            :key="pedido.ID_INSUMO_PEDIDO"
            cols="12"
            sm="4"
            md="4"
            lg="3"
          >
            <v-card
              class="pa-4 cardPedido"
              height="65px"
              :color="pedido.FINALIZADO === 'S' ? '#66BB6A' : 'primary'"
              @click="actions.visualizarPedido(pedido)"
              :class="{
                'card-selecionado': state.pedidoSelecionado?.ID_INSUMO_PEDIDO === pedido.ID_INSUMO_PEDIDO,
              }"
            >
              <v-row class="align-center justify-space-between cardPedidoDetalhes">
                <v-chip
                  class="vchipTotal"
                  color="white"
                >
                  {{ pedido.totalItens }} itens
                </v-chip>
                <span>{{ utils.dataBrasil(pedido.DATA_HORA_INICIO) }}</span>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div
        :style="{ minHeight: '20px' }"
        v-else
      ></div>
    </v-card>

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
    <div id="pnCodigoTela">solicitarInsumos</div>

    <v-dialog
      v-model="state.modalPedidoInsumosOpened"
      max-width="900"
      :persistent="true"
    >
      <ModalPedidoInsumos
        :modalOpened="state.modalPedidoInsumosOpened"
        :novoPedido="state.novoPedido"
        :pedidoSelecionado="state.pedidoSelecionado"
        :categoriasComItens="state.categoriasComItens"
        @closeModalPedidoInsumos="actions.closeModalPedido"
        @atualizarPedidoFinalizado="actions.atualizarPedidoFinalizado"
      />
    </v-dialog>
  </v-container>
</template>

<style scoped>
.cardPedido {
  font-weight: bold;
}

.card-selecionado {
  border: 2px solid #003fb48c;
  box-shadow: 0 0 5px rgba(6, 0, 130, 0.5);
}

.cardPedidoDetalhes {
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
}

.vchipTotal {
  font-weight: bold;
  border: 1px solid rgb(255, 255, 255);
}

.scroll-container {
  height: 450px;
  padding-right: 8px;
  margin-top: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
