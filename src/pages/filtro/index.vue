<script setup lang="ts">
import { onMounted } from "vue";
import { actions, state } from "./filtro";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 900px; margin: 0 auto"
    >
      <div class="divInputs">
        <div style="display: flex; gap: 16px">
          <v-autocomplete
            id="carros"
            label="Carros"
            class="carros"
            :items="state.carros"
            item-title="DESCRICAO"
            item-value="ID_CARRO"
            autocomplete="off"
            :clearable="true"
          ></v-autocomplete>
          <v-autocomplete
            id="marcas"
            label="Marcas"
            class="marcas"
            :items="state.marcas"
            autocomplete="off"
            item-title="DESCRICAO"
            item-value="ID_MARCA"
            :clearable="true"
          ></v-autocomplete>
          <v-text-field
            id="endEstoque"
            label="End. Estoque"
            class="endEstoque"
            autocomplete="off"
            item-title="title"
            item-value="value"
            :clearable="true"
          ></v-text-field>

          <v-text-field
            id="numFabricante"
            class="numFabricante"
            autocomplete="off"
            label="Num. Fabricante"
            :clearable="true"
          ></v-text-field>

          <v-text-field
            id="descricaoProduto"
            class="descricaoProduto"
            autocomplete="off"
            label="Descrição"
            :clearable="true"
          ></v-text-field>
        </div>
        <div class="btnPesquisar">
          <v-btn
            color="primary"
            class="mt-3"
            icon="mdi-magnify"
            size="36px"
            @click="actions.validarInputs"
          >
          </v-btn>
        </div>
      </div>

      <v-data-table-server
        class="tableSugestaoCompraAlteracao"
        items-per-page-text="Itens por página"
        v-model:itemsPerPage="state.itemsPerPage"
        :items-length="state.totalItems"
        style="border-radius: 5px; padding-top: 20px"
        height="400"
        fixed-header
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
        @update:page=""
      >
        <template #no-data>
          <v-alert
            :value="true"
            icon="mdi-information"
            style="background-color: #ffffff"
          >
            Não há dados disponíveis.
          </v-alert>
        </template>
      </v-data-table-server>

      <div class="pt-2 btnPrint">
        <v-btn
          color="primary"
          @click="actions.onClickImprimir"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
      </div>
    </v-card>
    <div id="pnCodigoTela">filtro</div>
  </v-container>
</template>

<style>
.v-overlay__scrim {
  background-color: black;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

.v-data-table-footer__pagination {
  padding-right: 50px;
}
</style>

<style scoped>
.divInputs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.btnPesquisar {
  margin-top: -15px;
  padding-left: 10px;
}

.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}

.carros,
.marcas,
.endEstoque,
.numFabricante,
.descricaoProduto {
  width: 150px;
}
</style>
