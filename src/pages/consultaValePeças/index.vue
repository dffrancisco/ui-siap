<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./consultarValePeças";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5 ma-auto"
      :max-width="900"
      :max-height="600"
    >
      <v-row>
        <v-col cols="4">
          <span>Curva</span>
          <v-select
            id="slCurva"
            v-model="state.curva"
            :items="state.curvasOptions"
            multiple
            item-value="value"
            item-title="label"
            style="width: 100%"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <span>Marca</span>
          <v-autocomplete
            id="slMarca"
            v-model="state.dbSelectMarca"
            :items="state.marcas"
            item-value="value"
            item-title="label"
            clearable
            style="width: 100%"
          ></v-autocomplete>
        </v-col>

        <v-col cols="3">
          <span>Filtro</span>
          <v-select
            id="slFiltro"
            v-model="state.filtro"
            :items="state.filtroOptions"
            item-value="value"
            item-title="label"
            :clearable="false"
            style="width: 100%"
          ></v-select>
        </v-col>

        <v-col cols="1">
          <div class="btnPesquisar">
            <v-btn
              class="mt-3"
              color="primary"
              icon="mdi-magnify"
              size="36px"
              @click="actions.buscarDadosComValidacao"
            >
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-data-table-server
          id="tabela"
          class="tableRelatorioCurva pt-5"
          v-model:items-per-page="state.itemsPerPage"
          :items="state.dadosRelatorio"
          :headers="state.headers"
          :items-length="state.totalItems"
          height="350px"
          style="border-radius: 5px"
          fixed-header
          :row-props="actions.getClassCorLinha"
          @update:page="actions.updatePage"
        >
        </v-data-table-server>
      </div>

      <div class="pt-5 btnPrint">
        <v-btn
          color="primary"
          @click="actions.onClickImprimir"
          :disabled="state.dadosRelatorio.length === 0"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        >
          <v-icon left>mdi-printer</v-icon>
        </v-btn>
      </div>
    </v-card>

    <div id="pnCodigoTela">CURVA_ABC</div>

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
  </v-container>
</template>

<style>
#tabela .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

#tabela .v-data-table-footer__pagination {
  padding-right: 50px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>

<style scoped>
.btnPrint {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
}

.btnPesquisar {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
