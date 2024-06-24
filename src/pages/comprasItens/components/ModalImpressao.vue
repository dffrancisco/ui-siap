<script setup lang="ts">
import { reactive } from "vue";
import { iProdutoAdicionadoObj, iTransportadora } from "../interfaces";
import printJS from "print-js";
import { MAP_COL_PRODUTO } from "../constants/constants";

const emits = defineEmits(["fecharModal"]);

const props = defineProps({
  transportadoras: {
    required: true,
    type: Array as () => iTransportadora[],
  },
  objProdutosAdicionados: {
    required: true,
    type: Object as () => iProdutoAdicionadoObj,
  },
});

const state = reactive({
  tipoImpressao: 0,
});

const actions = {
  fecharModal() {
    emits("fecharModal");
  },
  imprimirArquivo() {
    let dados = Object.values(props.objProdutosAdicionados);

    printJS({
      printable: dados,
      properties: [
        { field: MAP_COL_PRODUTO["NUM_FABRICANTE"], displayName: "Nº Fabricante" },
        { field: MAP_COL_PRODUTO["NUM_FABRICANTE2"], displayName: "Nº Fabricante 2" },
        { field: MAP_COL_PRODUTO["DESC_PRODUTO"], displayName: "Descrição" },
        { field: MAP_COL_PRODUTO["DESCRICAO_CARRO"], displayName: "Carro" },
        { field: MAP_COL_PRODUTO["DESCRICAO_MARCA"], displayName: "Marca" },
        { field: MAP_COL_PRODUTO["QUANTIDADE"], displayName: "Qtd" },
      ],
      type: "json",
      gridHeaderStyle: "border: 1px solid #000000",
      gridStyle: "text-align: center; border: 1px solid #000000",
    });
  },
};
</script>

<template>
  <v-card class="card-container">
    <div class="card-header px-6 pt-4">
      <span class="title-modal"> Imprimir </span>
      <v-icon
        size="28"
        @click="actions.fecharModal"
        >mdi-close</v-icon
      >
    </div>
    <div class="card-body px-6 pb-6 d-flex ga-5 flex-column">
      <v-radio-group
        v-model="state.tipoImpressao"
        inline
        class="d-flex justify-center"
      >
        <div class="radio mr-2">
          <v-radio
            :value="0"
            color="primary"
          ></v-radio>
          <span>Produto</span>
        </div>
        <div class="radio ml-2">
          <v-radio
            :value="1"
            color="primary"
          ></v-radio>
          <span>Cotação</span>
        </div>
      </v-radio-group>
      <div>
        <span class="title-transportadora">Transportadora</span>
        <v-autocomplete
          bg-color="#3B4758"
          variant="solo"
          density="comfortable"
          placeholder="Informe uma transportadora"
          :items="transportadoras"
          item-value="ID_TRANSPORTADORA"
          item-title="RAZAO_SOCIAL"
        >
        </v-autocomplete>
      </div>
      <div class="pt-4 d-flex justify-center ga-2">
        <v-btn
          height="40"
          class="btn-visualizar"
          ><v-icon class="mr-1">mdi-magnify</v-icon>visualizar</v-btn
        >
        <v-btn
          height="40"
          class="btn-imprimir"
          @click="actions.imprimirArquivo"
        >
          <v-icon class="mr-1">mdi-printer</v-icon>
          <span>imprimir</span>
        </v-btn>
        <v-btn
          height="40"
          class="btn-file"
          ><v-icon class="mr-1">mdi-file</v-icon>Arquivo</v-btn
        >
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.card-container {
  background-color: var(--grey-900);
  color: var(--grey-100);
  height: 274px;
}

.title-modal {
  font-size: 16px;
  color: var(--grey-100);
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radio {
  display: flex;
  align-items: center;
}

.title-transportadora {
  font-size: 12px;
  color: var(--grey-100);
  font-weight: 600;
}

.btn-visualizar {
  background-color: var(--primary-700);
  color: #fff;
  min-width: 135px;
}

.btn-imprimir {
  background-color: var(--success-600);
  color: #fff;
  min-width: 135px;
}

.btn-file {
  background-color: var(--info-700);
  color: #fff;
  min-width: 135px;
}
</style>
