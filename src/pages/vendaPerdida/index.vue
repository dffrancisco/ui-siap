<script setup lang="ts">
import { state, actions, meses } from "./vendaPerdida";
import { nextTick } from "vue";
import ModalDetalhesVendaPerdida from "./components/modalDetalhesVendaPerdida.vue";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 876px; margin: 0 auto"
    >
      <div
        class="divInputs"
        style=""
      >
        <div style="display: flex; gap: 16px">
          <v-select
            id="mes"
            label="Mês"
            class="obr"
            v-model="state.mes"
            item-title="title"
            item-value="value"
            style="width: 200px"
            :items="meses"
            :clearable="false"
          ></v-select>

          <v-text-field
            id="ano"
            class="obr"
            type="number"
            style="width: 200px"
            label="Ano"
            v-model="state.ano"
            :clearable="false"
          ></v-text-field>
        </div>
        <div class="btnPesquisar">
          <v-btn
            color="primary"
            class="mt-3"
            icon="mdi-magnify"
            size="36px"
            @click="actions.getVendasPerdidas"
          >
          </v-btn>
        </div>
      </div>

      <v-data-table
        class="tableVendaPerdida"
        no-data-text="Não há dados disponíveis"
        v-model:itemsPerPage="state.totalItems"
        style="border-radius: 5px"
        height="560"
        fixed-header
        :headers="state.headers"
        :loading="state.loading"
        :items="state.vendasPerdidas"
        :row-props="actions.getClassCorLinha"
      >
        <template v-slot:item.inf="{ item }">
          <v-icon
            size="large"
            color="primary"
            title="Ver detalhes"
            @click="actions.openModalDetalhesVendaPerdida(item)"
          >
            mdi-information
          </v-icon>
        </template>
        <template #bottom></template>
      </v-data-table>
      <div class="pt-2 btnPrint">
        <v-btn
          color="primary"
          @click="actions.imprimirVendasPerdidas"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
      </div>
    </v-card>

    <div
      id="modalVendaPerdidaDetalhes"
      style="display: none"
    >
      <ModalDetalhesVendaPerdida
        :vendaPerdidaDetalhada="state.vendaPerdidaDetalhada"
        :modalOpened="state.modalDetalhesVendaPerdidaOpened"
      />
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

    <div id="pnCodigoTela">VENDA_PERDIDA</div>
  </v-container>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.cor-zebrada-2 {
  background-color: #fff;
}
</style>

<style scoped>
.btnPrint {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.qtdVendaPerdida {
  margin-right: 50px;
}

.qtdEstoque {
  margin-right: 10px;
}

.tableVendaPerdida {
  margin-top: 20px;
}

.divInputs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.btnPesquisar {
  margin-top: -12px;
  margin-left: 10px;
}
</style>
