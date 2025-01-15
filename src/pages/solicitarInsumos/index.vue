<script setup lang="ts">
import { state, actions } from "./solicitarInsumos";
import ModalNovoPedidoInsumos from "./components/ModalNovoPedidoInsumos.vue";
</script>
<template
  ><v-container
    ><v-card
      :max-width="800"
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

      <v-row class="pa-4">
        <v-card> AQUII OS PEDIDOS </v-card>
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
      <ModalNovoPedidoInsumos @closeModalNovoPedidoInsumos="state.modalNovoPedidoInsumosOpened = false" />
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
