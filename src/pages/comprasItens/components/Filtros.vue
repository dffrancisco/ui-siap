<script setup lang="ts">
import { reactive, watch } from "vue";
import { iCarro, iMarca } from "../interfaces";

const props = defineProps({
  idMarcaInicial: {
    type: Number,
    default: undefined,
  },
  carros: {
    type: Array as () => iCarro[],
    required: true,
  },
  marcas: {
    type: Array as () => iMarca[],
    required: true,
  },
});

const emit = defineEmits(["buscarProdutos"]);

const invertalBusca = setInterval(() => actions.callEmitBuscarProdutos, 1000);

const state = reactive({
  edtNumFabricante: undefined,
  edtDescricao: undefined,
  edtCarro: undefined,
  edtMarca: undefined,
  tempoNovaBusca: 1000,
});

const actions = {
  callEmitBuscarProdutos: () => {
    clearInterval(stopTime);

    emit("buscarProdutos", {
      ID_MARCA: state.edtMarca,
      ID_CARRO: state.edtCarro,
      DESC_PRODUTO: state.edtDescricao,
      NUM_FABRICANTE: state.edtNumFabricante,
    });
  },
};

watch(
  () => props.idMarcaInicial,
  () => {
    if (props.idMarcaInicial) {
      state.edtMarca = props.idMarcaInicial;
    }
  }
);

let stopTime;

watch(
  () => [state.edtNumFabricante, state.edtDescricao],
  ([newNumFabricante, newDescricao], [oldNumFabricante, oldDescricao]) => {
    clearInterval(stopTime);

    stopTime = setInterval(() => {
      state.tempoNovaBusca = state.tempoNovaBusca - 100;

      if (state.tempoNovaBusca == 0) {
        state.tempoNovaBusca = 1000;

        if (newNumFabricante != oldNumFabricante) {
          actions.callEmitBuscarProdutos();
          return;
        }

        if (newDescricao != oldDescricao) {
          actions.callEmitBuscarProdutos();
        }
      }
    }, 100);
  }
);
</script>

<template>
  <div class="filtros">
    <div class="filtros-fabricante">
      <label>Nº Fabricante</label>
      <v-text-field
        v-model="state.edtNumFabricante"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        @keypress.enter="actions.callEmitBuscarProdutos"
      ></v-text-field>
    </div>
    <div class="filtros-descricao">
      <label>Descrição</label>
      <v-text-field
        v-model="state.edtDescricao"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        @keypress.enter="actions.callEmitBuscarProdutos"
      ></v-text-field>
    </div>
    <div class="filtros-carro">
      <label>Carro</label>
      <v-autocomplete
        v-model="state.edtCarro"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        :items="props.carros"
        item-value="ID_CARRO"
        item-title="NOME_CARRO"
        @update:model-value="actions.callEmitBuscarProdutos"
      ></v-autocomplete>
    </div>
    <div class="filtros-marca">
      <label>Marca</label>
      <v-autocomplete
        v-model="state.edtMarca"
        variant="outlined"
        density="compact"
        bg-color="#3b4758"
        :items="props.marcas"
        item-value="ID_MARCA"
        item-title="NOME_MARCA"
        :clearable="false"
        @update:model-value="actions.callEmitBuscarProdutos"
      ></v-autocomplete>
    </div>
    <div class="d-flex align-end">
      <v-btn
        color="#0077e4"
        height="40"
        width="50"
        min-width="50"
        class="pa-0"
      >
        <v-icon size="x-large">mdi mdi-printer</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filtros {
  width: 100%;
  display: flex;
  color: var(--grey-100);
  gap: 8px;
}

.filtros-fabricante {
  width: 180px;
}

.filtros-descricao {
  flex-grow: 1;
}

.filtros-carro {
  width: 220px;
}

.filtros-marca {
  width: 220px;
}
</style>
