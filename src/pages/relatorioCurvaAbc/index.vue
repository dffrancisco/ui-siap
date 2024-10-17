<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { actions } from "./relatorioCurvaAbc";

const state = reactive({
  marca: "",
  filtro: "",
  numFabricante: "",
  selectCurvaOptions: [
    { value: "AA", label: "AA" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
  ],
  filtroOptions: [
    { value: "geral", label: "Curva ABC Geral" },
    { value: "marca", label: "Curva ABC Marca" },
  ],
  marcas: [],
  dadosRelatorio: [],
  headers: [
    { text: "Nº Fabricante", value: "numFabricante" },
    { text: "Última Entrada", value: "ultimaEntrada" },
    { text: "Descrição", value: "descricao" },
    { text: "Marca", value: "marca" },
    { text: "Endereço", value: "endereco" },
    { text: "Qtd", value: "qtd" },
    { text: "Vendas", value: "vendas" },
    { text: "ABC Geral", value: "abcGeral" },
    { text: "ABC Marca", value: "abcMarca" },
  ],
  totalItems: 0,
  itemsPerPage: 10,
  loading: false,
});

onMounted(() => {
  actions.init();
});

const gerarRelatorio = async () => {
  state.loading = true;
  const response = await actions.getRelatorio({
    curva: state.numFabricante,
    filtro: state.filtro,
    marca: state.marca,
    itemsPerPage: state.itemsPerPage,
  });

  if (response) {
    state.dadosRelatorio = response.dadosRelatorio;
    state.totalItems = response.totalDadosRelatorio;
  } else {
    state.dadosRelatorio = [];
  }

  state.loading = false;
};
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 969px; margin: 0 auto"
    >
      <v-row>
        <v-col cols="4">
          <v-select
            id="curvaAbc"
            label="Curva ABC"
            class="curvaAbc"
            :items="state.selectCurvaOptions"
            v-model="state.numFabricante"
            item-title="label"
            item-value="value"
            :clearable="true"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            id="filtro"
            label="Filtro"
            class="filtro"
            v-model="state.filtro"
            item-title="label"
            item-value="value"
            :items="state.filtroOptions"
            :clearable="true"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            id="marca"
            label="Marca"
            class="marca"
            v-model="state.marca"
            item-title="label"
            item-value="value"
            :items="state.marcas"
            :clearable="true"
            :disabled="state.filtro !== 'marca'"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <div class="btnPesquisar">
            <v-btn
              color="primary"
              icon="mdi-magnify"
              size="36px"
              @click="actions.validarInputs"
            />
          </div>
        </v-col>
      </v-row>

      <v-data-table-server
        class="tableHistoricoConsultaLojas pt-5"
        items-per-page-text="Itens por página"
        v-model:itemsPerPage="state.itemsPerPage"
        :items-length="state.totalItems"
        style="border-radius: 5px"
        height="460"
        fixed-header
        :items="state.dadosRelatorio"
        :headers="state.headers"
        :loading="state.loading"
        :row-props="actions.getClassCorLinha"
        @update:page="actions.updatePage"
      >
      </v-data-table-server>

      <div class="pt-2 btnPrint">
        <v-btn
          color="primary"
          @click="actions.onClickImprimir"
          :disabled="state.dadosRelatorio.length === 0"
          icon="mdi-printer"
          size="36px"
          title="Imprimir"
        />
      </div>
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

    <div id="pnCodigoTela">relatorioCurvaAbc</div>
  </v-container>
</template>

<style>
.v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}

.v-data-table-footer__pagination {
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
</style>
