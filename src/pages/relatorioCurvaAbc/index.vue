<script setup lang="ts">
import { onMounted, ref } from "vue";
import { state, actions } from "./relatorioCurvaAbc";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 900px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="5">
          <span>Curva</span>
          <v-select
            id="slCurva"
            v-model="state.curva"
            :items="[
              { value: 'AA', label: 'AA' },
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
              { value: 'D', label: 'D' },
              { value: 'E', label: 'E' },
              { value: 'F', label: 'F' },
            ]"
            multiple
            item-value="value"
            item-title="label"
            clearable
            style="width: 100%"
          ></v-select>
        </v-col>

        <v-col cols="3">
          <span>Marca</span>
          <v-select
            id="slMarca"
            v-model="state.dbSelectMarca"
            :items="state.marcas"
            item-value="value"
            item-title="label"
            clearable
            style="width: 100%"
            label="Buscar marca..."
          ></v-select>
        </v-col>

        <v-col cols="3">
          <span>Filtro</span>
          <v-select
            id="slFiltro"
            v-model="state.filtro"
            :items="[
              { value: 'CURVA_ABC_G', label: 'Curva ABC Geral' },
              { value: 'CURVA_ABC_M', label: 'Curva ABC Marca' },
            ]"
            item-value="value"
            item-title="label"
            clearable
            style="width: 100%"
          ></v-select>
        </v-col>

        <v-col cols="1">
          <v-btn
            color="primary"
            icon="mdi-magnify"
            @click="actions.getDadosParaRelatorio()"
            style="margin-top: 13px; height: 27px; width: 27px"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="11">
          <v-data-table-server
            v-model:items-per-page="state.itemsPerPage"
            :items="state.dadosRelatorio"
            :loading="state.loading"
            :headers="state.headers"
            :items-length="state.totalItems"
            height="350px"
            fixed-header
            :row-props="actions.getClassCorLinha"
            @update:page="actions.updatePage"
            @update:options="actions.getDadosParaRelatorio"
          >
          </v-data-table-server>
        </v-col>
      </v-row>

      <div class="right-align">
        <v-btn
          color="light-blue darken-2"
          @click="actions.onClickImprimir()"
          :disabled="state.dadosRelatorio.length === 0"
        >
          <v-icon left>mdi-printer</v-icon>
          Imprimir
        </v-btn>
      </div>
    </v-card>

    <div id="pnCodigoTela">CURVA_ABC</div>

    <v-overlay :value="state.loading"> indeterminate color="primary" size="64" </v-overlay>
  </v-container>
</template>

<style scoped>
.right-align {
  text-align: right;
}
.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
