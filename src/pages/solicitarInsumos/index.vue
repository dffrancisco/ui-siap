<script setup lang="ts">
import { state, actions } from "./solicitarInsumos";
import ModalNovoPedidoInsumos from "./components/ModalNovoPedidoInsumos.vue";
import { onMounted } from "vue";
import utils from "@/ts/utils";

onMounted(async () => {
  await actions.init();
});
</script>
<template
  ><v-container
    ><v-card
      :max-width="800"
      :max-height="600"
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
            style="max-width: 200px"
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
          class="mr-3"
          @click="actions.novoPedido"
        >
          Novo Pedido (F2)
        </v-btn>
      </v-row>

      <v-row>
        <v-col
          v-for="pedido in state.pedidos"
          :key="pedido.ID_INSUMO_PEDIDO"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="pa-4 cardPedido"
            height="65px"
            :color="pedido.FINALIZADO === 'S' ? '#66BB6A' : 'primary'"
            @click="actions.visualizarPedido(pedido)"
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
      v-model="state.modalNovoPedidoInsumosOpened"
      max-width="900"
    >
      <ModalNovoPedidoInsumos
        :modalOpened="state.modalNovoPedidoInsumosOpened"
        :novoPedido="state.novoPedido"
        :pedidoSelecionado="state.pedidoSelecionado"
        @closeModalNovoPedidoInsumos="actions.closeModalNovoPedido"
      />
    </v-dialog>
  </v-container>
</template>

<style scoped>
.cardPedido {
  font-weight: bold;
}

.cardPedidoDetalhes {
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
}

.vchipTotal {
  font-weight: bold;
}
</style>
